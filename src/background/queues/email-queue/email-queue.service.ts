import type { IEmailJob } from '@/common/interfaces/job.interface';
import { MailService } from '@/mail/mail.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);

  constructor(private readonly mailService: MailService) {}

  async sendEmailVerification(data: IEmailJob): Promise<void> {
    this.logger.debug(`Sending email verification to ${data.email}`);
    await this.mailService.sendEmailVerification(data.email, data.url);
  }

  async sendForgotPassword(data: IEmailJob): Promise<void> {
    this.logger.debug(`Sending forgot password email to ${data.email}`);
    await this.mailService.sendForgotPassword(data.email, data.url);
  }
}
