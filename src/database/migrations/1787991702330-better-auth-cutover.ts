import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Cutover from custom JWT/passport auth to Better Auth.
 *
 * - user: shared table, reshaped for Better Auth (snake_case field mappings
 *   configured in src/api/auth/auth.ts). Passwords move to the account
 *   table (existing credentials are invalidated; seed anew).
 * - session/user_oauth_account: dropped, replaced by Better Auth's
 *   session/account/verification tables.
 * - post.user_id FK untouched.
 *
 * Column types cross-checked against `@better-auth/cli generate` output for
 * better-auth 1.7.2 (session.token text unique, account.issuer text with
 * unique (issuer, account_id), all timestamps timestamptz).
 */
export class BetterAuthCutover1787991702330 implements MigrationInterface {
  name = 'BetterAuthCutover1787991702330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- user: add Better Auth columns -------------------------------------
    await queryRunner.query(`
      ALTER TABLE "user"
        ADD COLUMN "email_verified" boolean NOT NULL DEFAULT false
    `);

    // --- drop legacy auth tables -------------------------------------------
    await queryRunner.query(`
      ALTER TABLE "session" DROP CONSTRAINT "FK_session_user"
    `);
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`
      ALTER TABLE "user_oauth_account" DROP CONSTRAINT "FK_e7dbc3437978eb398ced44bde57"
    `);
    await queryRunner.query(`DROP TABLE "user_oauth_account"`);
    await queryRunner.query(`
      DROP TYPE "public"."user_oauth_account_provider_enum"
    `);

    // --- user: drop legacy columns -----------------------------------------
    // created_by/updated_by: Better Auth owns this table now and does not
    // write audit columns. created_at/updated_at already exist with the
    // right shape.
    await queryRunner.query(`
      ALTER TABLE "user"
        DROP COLUMN "password",
        DROP COLUMN "created_by",
        DROP COLUMN "updated_by"
    `);

    // --- user: relax columns Better Auth writes null into -------------------
    // Better Auth inserts explicit NULL for image/bio when not provided.
    // username is an application-owned additional field, nullable by design.
    await queryRunner.query(`
      ALTER TABLE "user"
        ALTER COLUMN "image" DROP NOT NULL,
        ALTER COLUMN "bio" DROP NOT NULL,
        ALTER COLUMN "username" DROP NOT NULL
    `);

    // --- Better Auth core tables -------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "account" (
        "id" text NOT NULL,
        "user_id" uuid NOT NULL,
        "account_id" text NOT NULL,
        "provider_id" text NOT NULL,
        "issuer" text NOT NULL,
        "access_token" text,
        "refresh_token" text,
        "id_token" text,
        "access_token_expires_at" timestamptz,
        "refresh_token_expires_at" timestamptz,
        "scope" text,
        "password" text,
        "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamptz NOT NULL,
        CONSTRAINT "PK_account_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "verification" (
        "id" text NOT NULL,
        "identifier" text NOT NULL,
        "value" text NOT NULL,
        "expires_at" timestamptz NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamptz NOT NULL,
        CONSTRAINT "PK_verification_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "session" (
        "id" text NOT NULL,
        "token" text NOT NULL,
        "user_id" uuid NOT NULL,
        "expires_at" timestamptz NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamptz NOT NULL,
        "ip_address" text,
        "user_agent" text,
        CONSTRAINT "PK_session_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "session"
        ADD CONSTRAINT "FK_session_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_session_token" ON "session" ("token")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_session_user_id" ON "session" ("user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_account_user_id" ON "account" ("user_id")
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_account_issuer_account_id" ON "account" ("issuer", "account_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_verification_identifier" ON "verification" ("identifier")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // --- drop Better Auth tables -------------------------------------------
    await queryRunner.query(
      `DROP INDEX "public"."IDX_verification_identifier"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."UQ_account_issuer_account_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_account_user_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_session_user_id"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_session_token"`);
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_session_user"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "verification"`);
    await queryRunner.query(`DROP TABLE "account"`);

    // --- restore user columns ----------------------------------------------
    // Backfill nulls before restoring NOT NULL. Usernames must stay unique
    // (partial unique index on non-deleted rows), so generate distinct
    // placeholders per row instead of a constant.
    await queryRunner.query(`
      UPDATE "user" SET "bio" = ''
      WHERE "bio" IS NULL
    `);
    await queryRunner.query(`
      UPDATE "user" SET "image" = ''
      WHERE "image" IS NULL
    `);
    await queryRunner.query(`
      UPDATE "user"
      SET "username" = 'user_' || substr(md5(random()::text || "id"::text), 1, 12)
      WHERE "username" IS NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "user"
        ALTER COLUMN "username" SET NOT NULL,
        ALTER COLUMN "bio" SET NOT NULL,
        ALTER COLUMN "image" SET NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "user"
        ADD COLUMN "created_by" character varying NOT NULL DEFAULT 'system',
        ADD COLUMN "updated_by" character varying NOT NULL DEFAULT 'system',
        ADD COLUMN "password" character varying NOT NULL DEFAULT ''
    `);

    // --- restore legacy tables ---------------------------------------------
    await queryRunner.query(`
      CREATE TYPE "public"."user_oauth_account_provider_enum" AS ENUM('google', 'apple')
    `);
    await queryRunner.query(`
      CREATE TABLE "user_oauth_account" (
        "provider" "public"."user_oauth_account_provider_enum" NOT NULL,
        "provider_account_id" character varying NOT NULL,
        "user_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "created_by" character varying NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_by" character varying NOT NULL,
        CONSTRAINT "PK_9212e8c4527e1717817134532dc" PRIMARY KEY ("provider", "provider_account_id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "user_oauth_account"
        ADD CONSTRAINT "FK_e7dbc3437978eb398ced44bde57" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      CREATE TABLE "session" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "hash" character varying(255) NOT NULL,
        "user_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "created_by" character varying NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_by" character varying NOT NULL,
        CONSTRAINT "PK_session_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "session"
        ADD CONSTRAINT "FK_session_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // --- drop Better Auth user columns --------------------------------------
    await queryRunner.query(`
      ALTER TABLE "user" DROP COLUMN "email_verified"
    `);
  }
}
