import { MailProviderId } from '@/constants/mail.constant';

export type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export type SendMailResult = {
  id: string;
  provider: MailProviderId;
};

/**
 * Contract every mail transport implements. The abstract class itself is the
 * DI token: providers are bound with `{ provide: MailProvider, useClass: ... }`.
 */
export abstract class MailProvider {
  abstract send(options: SendMailOptions): Promise<SendMailResult>;
}
