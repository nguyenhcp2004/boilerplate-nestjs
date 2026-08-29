import { MailProviderId } from '@/constants/mail.constant';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
  MailProvider,
  SendMailOptions,
  SendMailResult,
} from '../mail-provider';

/**
 * Sends pre-rendered HTML through the existing nodemailer-backed
 * @nestjs-modules/mailer transport (SMTP, maildev in local dev).
 */
@Injectable()
export class SmtpProvider extends MailProvider {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async send(options: SendMailOptions): Promise<SendMailResult> {
    const info = await this.mailerService.sendMail({
      to: options.to,
      subject: options.subject,
      html: options.html,
      ...(options.text && { text: options.text }),
      ...(options.from && { from: options.from }),
    });

    return {
      id: info?.messageId ?? '',
      provider: MailProviderId.SMTP,
    };
  }
}
