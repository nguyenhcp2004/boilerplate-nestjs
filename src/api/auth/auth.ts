import type { IEmailJob } from '@/common/interfaces/job.interface';
import type { AllConfigType } from '@/config/config.type';
import { JobName } from '@/constants/job.constant';
import { redisStorage } from '@better-auth/redis-storage';
import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import type { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { Pool } from 'pg';

/**
 * The concrete auth instance built by createAuth. Named so consumers (the
 * BetterAuthModule factory, tests) depend on this module's contract
 * instead of re-deriving it.
 */
export type AuthInstance = ReturnType<typeof createAuth>;

/**
 * Builds the better-auth instance. Called from AuthModule's
 * BetterAuthModule.forRootAsync factory at DI time — after
 * ConfigModule.forRoot has loaded .env — so every connection option is
 * resolved from validated config instead of a not-yet-populated
 * process.env. The email callbacks enqueue through the BullMQ queue
 * injected by the same factory.
 */
export function createAuth(
  configService: ConfigService<AllConfigType>,
  emailQueue: Queue<IEmailJob>,
) {
  // Sessions, verification tokens, and rate-limit counters live in Redis
  // (docs default when secondaryStorage is set). The Postgres session table
  // stays in place but is no longer written for cookie sessions.
  //
  // Deliberately NOT set: session.storeSessionInDatabase /
  // session.preserveSessionInDatabase. Either one re-adds a Postgres write to
  // the sign-in hot path (dual write) to keep ended-session tombstones for
  // audit. Flip both on only if session audit trails become a requirement.
  const redis = {
    host: configService.getOrThrow('redis.host', { infer: true }),
    port: configService.getOrThrow('redis.port', { infer: true }),
    password: configService.getOrThrow('redis.password', { infer: true }),
    tls: configService.get('redis.tlsEnabled', { infer: true })
      ? {}
      : undefined,
  };

  function enqueueEmail(jobName: JobName, email: string, url: string): void {
    // Fire-and-forget: better-auth docs recommend not awaiting email sending
    // in these callbacks to prevent timing attacks. Failures surface through
    // BullMQ's retry/backoff instead of the HTTP response.
    void emailQueue
      .add(
        jobName,
        { email, url },
        { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
      )
      .catch((error: unknown) => {
        console.error(`[better-auth] failed to enqueue ${jobName}`, error);
      });
  }

  const corsOrigin = configService.get('app.corsOrigin', { infer: true });

  return betterAuth({
    baseURL: configService.getOrThrow('auth.url', { infer: true }),
    // Parsed from APP_CORS_ORIGIN (comma-separated) via app config;
    // better-auth also enforces these for CSRF on cookie flows. The type
    // allows RegExp entries (used by CORS, not better-auth), so filter to
    // the string origins better-auth accepts.
    trustedOrigins: Array.isArray(corsOrigin)
      ? corsOrigin.filter(
          (origin): origin is string => typeof origin === 'string',
        )
      : [],

    database: new Pool({
      host: configService.getOrThrow('database.host', { infer: true }),
      port: configService.getOrThrow('database.port', { infer: true }),
      user: configService.getOrThrow('database.username', { infer: true }),
      password: configService.getOrThrow('database.password', { infer: true }),
      database: configService.getOrThrow('database.name', { infer: true }),
    }),
    secondaryStorage: redisStorage({
      client: new Redis(redis),
      keyPrefix: 'better-auth:',
    }),

    advanced: {
      database: {
        // The shared user table uses uuid PKs; better-auth's session/account/
        // verification tables store text ids. A single generator must serve
        // both, and uuids are valid text ids.
        generateId: () => crypto.randomUUID(),
      },
    },

    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        enqueueEmail(JobName.EMAIL_PASSWORD_RESET, user.email, url);
      },
    },

    emailVerification: {
      // Send on sign-up so local rows reach emailVerified=true — the
      // account-linking gate (link-account.mjs:83) refuses to auto-link an
      // OAuth identity onto an unverified local row.
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        enqueueEmail(JobName.EMAIL_VERIFICATION, user.email, url);
      },
    },

    socialProviders: {
      google: {
        clientId: configService.getOrThrow('auth.googleClientId', {
          infer: true,
        }),
        clientSecret: configService.getOrThrow('auth.googleClientSecret', {
          infer: true,
        }),
      },
    },

    user: {
      additionalFields: {
        username: { type: 'string', required: false },
        bio: { type: 'string', required: false },
      },
      // snake_case DB columns (see migration 1787991702330); type inference in
      // code still uses the original camelCase names.
      fields: {
        emailVerified: 'email_verified',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    },
    session: {
      fields: {
        expiresAt: 'expires_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        ipAddress: 'ip_address',
        userAgent: 'user_agent',
        userId: 'user_id',
      },
    },
    account: {
      fields: {
        accountId: 'account_id',
        providerId: 'provider_id',
        userId: 'user_id',
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        idToken: 'id_token',
        accessTokenExpiresAt: 'access_token_expires_at',
        refreshTokenExpiresAt: 'refresh_token_expires_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
      // Implicit account linking on OAuth sign-in: a user who signed up with
      // email/password gets their google account linked automatically on the
      // first google sign-in with the same (verified) email. google is
      // trusted because google guarantees email_verified for its own
      // addresses; linking still requires the local user row to have
      // emailVerified=true (better-auth default, enforced unconditionally
      // in the next minor — an unverified local row is never auto-linked).
      accountLinking: {
        enabled: true,
        trustedProviders: ['google'],
      },
    },
    verification: {
      fields: {
        expiresAt: 'expires_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    },
  });
}
