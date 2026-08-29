import { AllConfigType } from '@/config/config.type';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailProvider } from './mail-provider';
import { MailTemplateRenderer } from './mail-template.renderer';
import type { MailModuleOptions } from './mail.module-definition';
import { MODULE_OPTIONS_TOKEN } from './mail.module-definition';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly mailProvider: MailProvider,
    private readonly renderer: MailTemplateRenderer,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: MailModuleOptions,
  ) {}

  async sendEmailVerification(email: string, token: string) {
    // Please replace the URL with your own frontend URL
    const url = `${this.configService.get('app.url', { infer: true })}/api/v1/auth/verify/email?token=${token}`;

    await this.mailProvider.send({
      to: email,
      subject: 'Email Verification',
      from: this.options.defaults.from,
      html: this.renderer.render('email-verification', {
        email: email,
        url: url,
      }),
    });
  }
}
