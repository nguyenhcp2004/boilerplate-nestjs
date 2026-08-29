import { HttpService } from '@nestjs/axios';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import { ResendProvider } from './resend.provider';

describe('ResendProvider', () => {
  const apiKey = 're_test_key';
  const baseUrl = 'https://api.resend.com';

  let httpService: { post: jest.Mock };
  let provider: ResendProvider;

  beforeEach(() => {
    httpService = { post: jest.fn() };
    provider = new ResendProvider(
      httpService as unknown as HttpService,
      apiKey,
      baseUrl,
    );
  });

  const response = (status: number, data: unknown): AxiosResponse =>
    ({
      status,
      data,
      headers: {},
      statusText: '',
      config: { headers: new AxiosHeaders() },
    }) as AxiosResponse;

  it('should post the rendered email to the resend api', async () => {
    httpService.post.mockReturnValue(of(response(200, { id: 'email-id-1' })));

    const result = await provider.send({
      to: 'user@example.com',
      subject: 'Verify',
      html: '<p>html</p>',
      from: 'No Reply <noreply@example.com>',
    });

    expect(httpService.post).toHaveBeenCalledWith(
      `${baseUrl}/emails`,
      {
        from: 'No Reply <noreply@example.com>',
        to: 'user@example.com',
        subject: 'Verify',
        html: '<p>html</p>',
      },
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    expect(result).toEqual({ id: 'email-id-1', provider: 'resend' });
  });

  it('should throw with the resend message on an error status', async () => {
    httpService.post.mockReturnValue(
      of(response(422, { message: 'invalid from address' })),
    );

    await expect(
      provider.send({
        to: 'user@example.com',
        subject: 'Verify',
        html: '<p>html</p>',
        from: 'bad@unverified',
      }),
    ).rejects.toThrow('resend: invalid from address (status 422)');
  });

  it('should propagate http errors', async () => {
    httpService.post.mockReturnValue(
      throwError(() => new Error('network down')),
    );

    await expect(
      provider.send({ to: 'user@example.com', subject: 's', html: '<p>h</p>' }),
    ).rejects.toThrow('network down');
  });
});
