import { SmtpProvider } from './smtp.provider';

describe('SmtpProvider', () => {
  let provider: SmtpProvider;
  let mailerService: { sendMail: jest.Mock };

  beforeEach(() => {
    mailerService = { sendMail: jest.fn() };
    provider = new SmtpProvider(mailerService as never);
  });

  it('should send pre-rendered html through nodemailer', async () => {
    mailerService.sendMail.mockResolvedValue({ messageId: '<abc@maildev>' });

    const result = await provider.send({
      to: 'user@example.com',
      subject: 'Verify',
      html: '<p>html</p>',
    });

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'Verify',
      html: '<p>html</p>',
    });
    expect(result).toEqual({ id: '<abc@maildev>', provider: 'smtp' });
  });

  it('should forward text and from when provided', async () => {
    mailerService.sendMail.mockResolvedValue({ messageId: 'id' });

    await provider.send({
      to: 'user@example.com',
      subject: 'Verify',
      html: '<p>html</p>',
      text: 'plain',
      from: 'No Reply <noreply@example.com>',
    });

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'Verify',
      html: '<p>html</p>',
      text: 'plain',
      from: 'No Reply <noreply@example.com>',
    });
  });

  it('should propagate transport errors', async () => {
    mailerService.sendMail.mockRejectedValue(new Error('connect ECONNREFUSED'));

    await expect(
      provider.send({ to: 'user@example.com', subject: 's', html: '<p>h</p>' }),
    ).rejects.toThrow('connect ECONNREFUSED');
  });
});
