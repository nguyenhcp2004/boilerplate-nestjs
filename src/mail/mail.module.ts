import { AllConfigType } from '@/config/config.type';
import { MailProviderId } from '@/constants/mail.constant';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { HttpModule, HttpService } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailProvider } from './mail-provider';
import { MailTemplateRenderer } from './mail-template.renderer';
import type { MailModuleOptions } from './mail.module-definition';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './mail.module-definition';
import { MailService } from './mail.service';
import { ResendProvider } from './providers/resend.provider';
import { SmtpProvider } from './providers/smtp.provider';

const VALID_PROVIDERS = Object.values(MailProviderId);

/**
 * Mail transport is chosen at the import site:
 *
 *   MailModule.forRoot({ provider: 'resend', resend: { apiKey }, defaults })
 *
 * or, driven by config:
 *
 *   MailModule.forRootAsync({ inject: [ConfigService], useFactory })
 *
 * Global by default so MailService consumers stay unchanged.
 */
@Module({})
export class MailModule extends ConfigurableModuleClass {
  static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    const module = super.forRoot(options);

    return {
      ...module,
      imports: [
        ...(module.imports ?? []),
        HttpModule,
        MailerModule.forRoot({
          transport: {
            host: options.smtp?.host,
            port: options.smtp?.port,
            ignoreTLS: options.smtp?.ignoreTLS,
            secure: options.smtp?.secure,
            requireTLS: options.smtp?.requireTLS,
            auth: {
              user: options.smtp?.user,
              pass: options.smtp?.password,
            },
          },
        }),
      ],
      providers: [
        ...(module.providers ?? []),
        this.mailProvider(),
        MailTemplateRenderer,
        MailService,
      ],
      exports: [...(module.exports ?? []), MailService],
    };
  }

  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const module = super.forRootAsync(options);

    return {
      ...module,
      imports: [
        ...(module.imports ?? []),
        HttpModule,
        MailerModule.forRootAsync({
          useFactory: (config: ConfigService<AllConfigType>) => ({
            transport: {
              host: config.get('mail.smtp.host', { infer: true }),
              port: config.get('mail.smtp.port', { infer: true }),
              ignoreTLS: config.get('mail.smtp.ignoreTLS', { infer: true }),
              secure: config.get('mail.smtp.secure', { infer: true }),
              requireTLS: config.get('mail.smtp.requireTLS', { infer: true }),
              auth: {
                user: config.get('mail.smtp.user', { infer: true }),
                pass: config.get('mail.smtp.password', { infer: true }),
              },
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        ...(module.providers ?? []),
        this.mailProvider(),
        MailTemplateRenderer,
        MailService,
      ],
      exports: [...(module.exports ?? []), MailService],
    };
  }

  /**
   * Binds the active transport from the resolved module options. Used by both
   * forRoot (options as value) and forRootAsync (options from factory).
   * Resend posts to an absolute URL, so a plain HttpModule suffices.
   */
  private static mailProvider(): Provider {
    return {
      provide: MailProvider,
      useFactory: (
        options: MailModuleOptions,
        mailerService: MailerService,
        httpService: HttpService,
      ) => {
        switch (options.provider) {
          case MailProviderId.SMTP:
            return new SmtpProvider(mailerService);
          case MailProviderId.RESEND:
            return new ResendProvider(
              httpService,
              options.resend?.apiKey ?? '',
              options.resend?.baseUrl ?? 'https://api.resend.com',
            );
          default:
            throw new Error(
              `Unsupported mail provider: ${String(options.provider)}. Valid providers: ${VALID_PROVIDERS.join(', ')}`,
            );
        }
      },
      inject: [MODULE_OPTIONS_TOKEN, MailerService, HttpService],
    };
  }
}
