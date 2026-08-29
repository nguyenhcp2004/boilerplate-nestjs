import { MailProviderId } from '@/constants/mail.constant';
import { ConfigurableModuleBuilder } from '@nestjs/common';
import type { ResendConfig, SmtpConfig } from './config/mail-config.type';

export type MailModuleOptions = {
  /** Which transport to bind as the active MailProvider. */
  provider: MailProviderId;
  /** Default `from` address, e.g. `"No Reply" <noreply@example.com>`. */
  defaults: {
    from: string;
  };
  /** Required when provider is smtp. */
  smtp?: SmtpConfig;
  /** Required when provider is resend. */
  resend?: ResendConfig;
};

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<MailModuleOptions>()
  .setClassMethodName('forRoot')
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .build();
