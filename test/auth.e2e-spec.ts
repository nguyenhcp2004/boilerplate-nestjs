import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * E2E for the better-auth cutover. Runs against the services defined in
 * .env (docker: postgres on 25432, redis on 6379, maildev on 1025).
 *
 * Verifies:
 * - better-auth routes are mounted at /api/auth (global prefix + wrapper
 *   basePath exclusion interplay)
 * - sign-up sets a session cookie and creates user + credential account
 * - cookie-authenticated access to an application route (/api/v1/users/me)
 * - anonymous access to an application route is rejected (401) when not
 *   allowed
 */
describe('Better Auth (e2e)', () => {
  let app: INestApplication;
  const testEmail = `e2e-${Date.now()}@example.com`;
  const testPassword = 'password123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Mirror main.ts bootstrap order (setGlobalPrefix after module init —
    // this is the interplay under test).
    app.setGlobalPrefix('api', {
      exclude: [{ path: '/', method: 0 }],
    });
    app.enableVersioning({ type: 0 as never, prefix: 'v' });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('exposes better-auth handler at /api/auth (POST sign-up/email)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/sign-up/email')
      .send({
        name: 'E2E User',
        email: testEmail,
        password: testPassword,
        username: `e2e${Date.now()}`,
        bio: 'created by e2e',
      })
      .expect((res) => {
        if (res.status !== 201 && res.status !== 200) {
          throw new Error(
            `sign-up failed: ${res.status} ${JSON.stringify(res.body)}`,
          );
        }
      });

    // Session cookie must be set
    const setCookie = (res.headers['set-cookie'] ?? []) as string[];
    expect(setCookie.length).toBeGreaterThan(0);
    expect(
      setCookie.some((c) => c.startsWith('better-auth.session_token=')),
    ).toBe(true);
  });

  it('rejects wrong-password sign-in', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/sign-in/email')
      .send({ email: testEmail, password: 'wrong-password' })
      .expect(401);
  });

  it('signs in with correct password and sets a session cookie', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/sign-in/email')
      .send({ email: testEmail, password: testPassword })
      .expect(200);

    const setCookie = (res.headers['set-cookie'] ?? []) as string[];
    expect(
      setCookie.some((c) => c.startsWith('better-auth.session_token=')),
    ).toBe(true);
  });

  it('returns session via /api/auth/get-session with cookie', async () => {
    const signIn = await request(app.getHttpServer())
      .post('/api/auth/sign-in/email')
      .send({ email: testEmail, password: testPassword })
      .expect(200);

    const cookies = (signIn.headers['set-cookie'] ?? []) as string[];
    const cookieHeader = cookies.map((c) => c.split(';')[0]).join('; ');

    await request(app.getHttpServer())
      .get('/api/auth/get-session')
      .set('Cookie', cookieHeader)
      .expect(200)
      .expect((res) => {
        if (!res.body?.user?.email) {
          throw new Error(
            `expected session user, got ${JSON.stringify(res.body)}`,
          );
        }
      });
  });

  it('rejects unauthenticated access to protected app route (401)', async () => {
    await request(app.getHttpServer()).get('/api/v1/users/me').expect(401);
  });

  it('allows cookie-authenticated access to app route /api/v1/users/me', async () => {
    const signIn = await request(app.getHttpServer())
      .post('/api/auth/sign-in/email')
      .send({ email: testEmail, password: testPassword })
      .expect(200);

    const cookies = (signIn.headers['set-cookie'] ?? []) as string[];
    const cookieHeader = cookies.map((c) => c.split(';')[0]).join('; ');

    await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Cookie', cookieHeader)
      .expect(200)
      .expect((res) => {
        if (res.body?.email !== testEmail) {
          throw new Error(
            `expected ${testEmail}, got ${JSON.stringify(res.body)}`,
          );
        }
      });
  });

  it('still serves public home route without auth', async () => {
    await request(app.getHttpServer()).get('/').expect(200);
  });
});
