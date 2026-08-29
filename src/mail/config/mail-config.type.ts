import { MailProviderId } from '@/constants/mail.constant';

export type SmtpConfig = {
  host: string;
  port: number;
  user?: string;
  password?: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
};

export type ResendConfig = {
  apiKey: string;
  baseUrl: string;
};

export type MailConfig = {
  provider: MailProviderId;
  defaultEmail?: string;
  defaultName?: string;
  smtp: SmtpConfig;
  resend: ResendConfig;
};
