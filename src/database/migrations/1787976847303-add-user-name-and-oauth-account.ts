import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserNameAndOauthAccount1787976847303
  implements MigrationInterface
{
  name = 'AddUserNameAndOauthAccount1787976847303';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
            ALTER TABLE "user"
            ADD "name" character varying NOT NULL DEFAULT ''
        `);
    await queryRunner.query(`
            ALTER TABLE "user_oauth_account"
            ADD CONSTRAINT "FK_e7dbc3437978eb398ced44bde57" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_oauth_account" DROP CONSTRAINT "FK_e7dbc3437978eb398ced44bde57"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            DROP TABLE "user_oauth_account"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_oauth_account_provider_enum"
        `);
  }
}
