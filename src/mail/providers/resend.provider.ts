import { MailProviderId } from '@/constants/mail.constant';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  MailProvider,
  SendMailOptions,
  SendMailResult,
} from '../mail-provider';

type ResendSendResponse = {
  id?: string;
  message?: string;
  name?: string;
};

/**
 * Sends pre-rendered HTML through the Resend HTTP API.
 * Non-2xx responses throw so the BullMQ email job can retry them.
 */
@Injectable()
export class ResendProvider extends MailProvider {
  private readonly logger = new Logger(ResendProvider.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly apiKey: string,
    private readonly baseUrl: string,
  ) {
    super();
  }

  async send(options: SendMailOptions): Promise<SendMailResult> {
    const response = await firstValueFrom(
      this.httpService.post<ResendSendResponse>(
        `${this.baseUrl.replace(/\/+$/, '')}/emails`,
        {
          from: options.from,
          to: options.to,
          subject: options.subject,
          html: options.html,
          ...(options.text && { text: options.text }),
        },
        {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        },
      ),
    );

    if (response.status < 200 || response.status >= 300) {
      const detail = response.data?.message ?? 'unknown error';
      this.logger.error(
        `resend send failed: status=${response.status} message=${detail}`,
      );
      throw new Error(`resend: ${detail} (status ${response.status})`);
    }

    return {
      id: response.data?.id ?? '',
      provider: MailProviderId.RESEND,
    };
  }
}
