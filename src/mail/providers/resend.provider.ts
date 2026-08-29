import { MailProviderId } from '@/constants/mail.constant';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
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
    try {
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
        throw this.sendError(response.status, response.data);
      }

      return {
        id: response.data?.id ?? '',
        provider: MailProviderId.RESEND,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw this.sendError(
          error.response.status,
          error.response.data as ResendSendResponse,
        );
      }
      throw error;
    }
  }

  private sendError(status: number, data?: ResendSendResponse): Error {
    const detail = data?.message ?? data?.name ?? 'unknown error';
    this.logger.error(`resend send failed: status=${status} message=${detail}`);
    return new Error(`resend: ${detail} (status ${status})`);
  }
}
