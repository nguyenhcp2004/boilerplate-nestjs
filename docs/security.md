# Security

Ensuring the security of your application is paramount. This document outlines the security measures implemented in this project, including authentication, authorization, encryption, hashing, and various HTTP security headers.

---

[[toc]]

## Authentication

Authentication is handled by [Better Auth](https://www.better-auth.com/), mounted through [`@thallesp/nestjs-better-auth`](https://github.com/ThallesP/nestjs-better-auth). The Better Auth handler is exposed at `/api/auth/*` and uses HttpOnly cookie sessions (`better-auth.session_token`). All routes are protected by a global `AuthGuard` unless annotated with `@AllowAnonymous()` or `@OptionalAuth()`.

Supported flows:

- Email + password (`/api/auth/sign-up/email`, `/api/auth/sign-in/email`, `/api/auth/sign-out`)
- Google OAuth (`/api/auth/sign-in/social`)
- Email verification and password reset — emails are enqueued through BullMQ and sent by the mail module

Credentials are stored in the `account` table (provider `credential`); Better Auth hashes passwords with scrypt. The `user` table is shared between Better Auth and the application (TypeORM `UserEntity`), with `username`/`bio` as additional fields.

## Authorization

Authorization is the process of determining if a user has permission to perform a certain action or access a specific resource. Role-based access control is available via Better Auth plugins (see the Better Auth [admin](https://www.better-auth.com/docs/plugins/admin) and [organization](https://www.better-auth.com/docs/plugins/organization) docs); the NestJS wrapper provides `@Roles()`, `@OrgRoles()`, and permission decorators.

## Encryption and Hashing

Password hashing is owned by Better Auth (scrypt, stored in the `account` table). No application-level password hashing code remains.

## Helmet

Helmet helps secure your NestJS apps by setting various HTTP headers. It's not a silver bullet, but it can help prevent some well-known web vulnerabilities by setting headers like X-Frame-Options, X-XSS-Protection, and Strict-Transport-Security. Simply add it to your NestJS app with minimal configuration:

```ts title="src/main.ts"
...
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(helmet());
  ...
}
```

## CORS

Cross-Origin Resource Sharing (CORS) is a security feature that restricts how resources on a web page can be requested from another domain outside the domain from which the first resource was served. In NestJS, you can enable CORS with the `enableCors` method. Here's an example of how to enable CORS with a specific origin:

```ts title="src/main.ts"
...
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const corsOrigin = configService.getOrThrow('app.corsOrigin', {
    infer: true,
  });

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  console.log('\nCORS Origin:', corsOrigin);
  ...
}
```

Please note that enabling CORS with a wildcard (`*`) is not recommended for production environments, as it can expose your application to security vulnerabilities.

You need to set the `APP_CORS_ORIGIN` environment variable to the domain you want to allow requests from. For example, if you want to allow requests from `https://example.com`, you would set `APP_CORS_ORIGIN` to `https://example.com`.

```env
APP_CORS_ORIGIN=https://example.com
```

## Rate limiting

Rate limiting is crucial for preventing abuse and ensuring that your service remains available to all users. Implement rate limiting using the express-rate-limit middleware:

```ts title="src/main.ts"
...
```

By implementing these security measures, you can significantly increase the security and resilience of your application against common web threats.
