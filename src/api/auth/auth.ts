import type { IEmailJob } from '@/common/interfaces/job.interface';
import { JobName } from '@/constants/job.constant';
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

/**
 * Bridge between the module-scope Better Auth instance (created at import
 * time, before Nest's DI container exists) and the Nest-managed BullMQ email
 * queue. The EmailQueueBridgeProvider binds a sender here once the DI
 * container is ready.
 */
export interface EmailQueueSender {
  add(
    jobName: JobName,
    data: IEmailJob,
    opts?: { attempts?: number; backoff?: { type: string; delay: number } },
  ): Promise<unknown>;
}

const emailQueueBridge: { sender: EmailQueueSender | null } = { sender: null };

export function bindEmailQueueSender(sender: EmailQueueSender): void {
  emailQueueBridge.sender = sender;
}

function enqueueEmail(jobName: JobName, email: string, url: string): void {
  // Fire-and-forget: better-auth docs recommend not awaiting email sending
  // in these callbacks to prevent timing attacks. Failures surface through
  // BullMQ's retry/backoff instead of the HTTP response.
  const sender = emailQueueBridge.sender;
  if (!sender) {
    console.warn(
      `[better-auth] email queue not bound yet, dropping ${jobName} email to ${email}`,
    );
    return;
  }
  void sender
    .add(
      jobName,
      { email, url },
      { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    )
    .catch((error: unknown) => {
      console.error(`[better-auth] failed to enqueue ${jobName}`, error);
    });
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  // Parsed from APP_CORS_ORIGIN (comma-separated) via app config; better-auth
  // also enforces these for CSRF on cookie flows.
  trustedOrigins: (process.env.APP_CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  database: new Pool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
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
    sendVerificationEmail: async ({ user, url }) => {
      enqueueEmail(JobName.EMAIL_VERIFICATION, user.email, url);
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET ?? '',
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
  },
  verification: {
    fields: {
      expiresAt: 'expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
});
