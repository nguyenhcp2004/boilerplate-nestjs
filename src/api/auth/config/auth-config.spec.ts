import authConfig from './auth.config';

describe('AuthConfig', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset process.env to its original state before each test
    process.env = { ...originalEnv };
  });

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
  });

  describe('secret', () => {
    it('should return the value of BETTER_AUTH_SECRET', async () => {
      process.env.BETTER_AUTH_SECRET = 'secret';
      const config = await authConfig();
      expect(config.secret).toBe('secret');
    });

    it('should throw an error when BETTER_AUTH_SECRET is an empty', async () => {
      process.env.BETTER_AUTH_SECRET = '';
      await expect(async () => await authConfig()).rejects.toThrow(Error);
    });

    it('should throw an error when BETTER_AUTH_SECRET is not set', async () => {
      delete process.env.BETTER_AUTH_SECRET;
      await expect(async () => await authConfig()).rejects.toThrow(Error);
    });
  });

  describe('url', () => {
    it('should return the value of BETTER_AUTH_URL', async () => {
      process.env.BETTER_AUTH_URL = 'http://localhost:3000';
      const config = await authConfig();
      expect(config.url).toBe('http://localhost:3000');
    });

    it('should throw an error when BETTER_AUTH_URL is an empty', async () => {
      process.env.BETTER_AUTH_URL = '';
      await expect(async () => await authConfig()).rejects.toThrow(Error);
    });

    it('should throw an error when BETTER_AUTH_URL is not set', async () => {
      delete process.env.BETTER_AUTH_URL;
      await expect(async () => await authConfig()).rejects.toThrow(Error);
    });

    it('should throw an error when BETTER_AUTH_URL is not a valid url', async () => {
      process.env.BETTER_AUTH_URL = 'not a url';
      await expect(async () => await authConfig()).rejects.toThrow(Error);
    });
  });

  describe('googleClientId', () => {
    it('should return the value of AUTH_GOOGLE_CLIENT_ID', async () => {
      process.env.AUTH_GOOGLE_CLIENT_ID = 'client-id';
      const config = await authConfig();
      expect(config.googleClientId).toBe('client-id');
    });

    it('should throw an error when AUTH_GOOGLE_CLIENT_ID is not set', async () => {
      delete process.env.AUTH_GOOGLE_CLIENT_ID;
      await expect(async () => await authConfig()).rejects.toThrow(Error);
    });
  });

  describe('googleClientSecret', () => {
    it('should return the value of AUTH_GOOGLE_CLIENT_SECRET', async () => {
      process.env.AUTH_GOOGLE_CLIENT_SECRET = 'client-secret';
      const config = await authConfig();
      expect(config.googleClientSecret).toBe('client-secret');
    });

    it('should throw an error when AUTH_GOOGLE_CLIENT_SECRET is not set', async () => {
      delete process.env.AUTH_GOOGLE_CLIENT_SECRET;
      await expect(async () => await authConfig()).rejects.toThrow(Error);
    });
  });
});
