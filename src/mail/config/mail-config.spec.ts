import mailConfig from './mail.config';

describe('MailConfig', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset process.env to its original state before each test
    process.env = { ...originalEnv };
  });

  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  const clearSmtpVars = () => {
    delete process.env.MAIL_HOST;
    delete process.env.MAIL_PORT;
    delete process.env.MAIL_USER;
    delete process.env.MAIL_PASSWORD;
    delete process.env.MAIL_IGNORE_TLS;
    delete process.env.MAIL_SECURE;
    delete process.env.MAIL_REQUIRE_TLS;
  };

  describe('provider', () => {
    it('should default to smtp when MAIL_PROVIDER is not set', async () => {
      delete process.env.MAIL_PROVIDER;
      process.env.MAIL_HOST = 'localhost';
      process.env.MAIL_PORT = '1025';

      const config = await mailConfig();
      expect(config.provider).toBe('smtp');
    });

    it('should return resend when MAIL_PROVIDER is resend', async () => {
      process.env.MAIL_PROVIDER = 'resend';
      process.env.RESEND_API_KEY = 're_test_key';
      clearSmtpVars();

      const config = await mailConfig();
      expect(config.provider).toBe('resend');
    });

    it('should throw when MAIL_PROVIDER is not a valid provider', async () => {
      process.env.MAIL_PROVIDER = 'carrier-pigeon';

      await expect(async () => await mailConfig()).rejects.toThrow(Error);
    });
  });

  describe('smtp', () => {
    it('should require MAIL_HOST when provider is smtp', async () => {
      process.env.MAIL_PROVIDER = 'smtp';
      delete process.env.MAIL_HOST;

      await expect(async () => await mailConfig()).rejects.toThrow(Error);
    });

    it('should not require SMTP vars when provider is resend', async () => {
      process.env.MAIL_PROVIDER = 'resend';
      process.env.RESEND_API_KEY = 're_test_key';
      clearSmtpVars();

      const config = await mailConfig();
      expect(config).toBeDefined();
    });
  });

  describe('resend', () => {
    it('should require RESEND_API_KEY when provider is resend', async () => {
      process.env.MAIL_PROVIDER = 'resend';
      delete process.env.RESEND_API_KEY;
      clearSmtpVars();

      await expect(async () => await mailConfig()).rejects.toThrow(Error);
    });

    it('should default RESEND_BASE_URL to https://api.resend.com', async () => {
      process.env.MAIL_PROVIDER = 'resend';
      process.env.RESEND_API_KEY = 're_test_key';
      delete process.env.RESEND_BASE_URL;
      clearSmtpVars();

      const config = await mailConfig();
      expect(config.resend.baseUrl).toBe('https://api.resend.com');
    });

    it('should not require RESEND_API_KEY when provider is smtp', async () => {
      process.env.MAIL_PROVIDER = 'smtp';
      delete process.env.RESEND_API_KEY;
      const config = await mailConfig();
      expect(config).toBeDefined();
    });
  });
});
