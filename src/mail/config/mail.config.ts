import { MailProviderId } from '@/constants/mail.constant';
import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { MailConfig } from './mail-config.type';

class EnvironmentVariablesValidator {
  @IsIn([MailProviderId.SMTP, MailProviderId.RESEND])
  @IsOptional()
  MAIL_PROVIDER: MailProviderId;

  @IsEmail()
  MAIL_DEFAULT_EMAIL: string;

  @IsString()
  MAIL_DEFAULT_NAME: string;

  @ValidateIf(
    (envValues) =>
      !envValues.MAIL_PROVIDER ||
      envValues.MAIL_PROVIDER === MailProviderId.SMTP,
  )
  @IsString()
  @IsNotEmpty()
  MAIL_HOST: string;

  @ValidateIf(
    (envValues) =>
      !envValues.MAIL_PROVIDER ||
      envValues.MAIL_PROVIDER === MailProviderId.SMTP,
  )
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  MAIL_PORT: number;

  @ValidateIf(
    (envValues) =>
      !envValues.MAIL_PROVIDER ||
      envValues.MAIL_PROVIDER === MailProviderId.SMTP,
  )
  @IsString()
  @IsOptional()
  MAIL_USER: string;

  @ValidateIf(
    (envValues) =>
      !envValues.MAIL_PROVIDER ||
      envValues.MAIL_PROVIDER === MailProviderId.SMTP,
  )
  @IsString()
  @IsOptional()
  MAIL_PASSWORD: string;

  @ValidateIf(
    (envValues) =>
      !envValues.MAIL_PROVIDER ||
      envValues.MAIL_PROVIDER === MailProviderId.SMTP,
  )
  @IsBoolean()
  MAIL_IGNORE_TLS: boolean;

  @ValidateIf(
    (envValues) =>
      !envValues.MAIL_PROVIDER ||
      envValues.MAIL_PROVIDER === MailProviderId.SMTP,
  )
  @IsBoolean()
  MAIL_SECURE: boolean;

  @ValidateIf(
    (envValues) =>
      !envValues.MAIL_PROVIDER ||
      envValues.MAIL_PROVIDER === MailProviderId.SMTP,
  )
  @IsBoolean()
  MAIL_REQUIRE_TLS: boolean;

  @ValidateIf((envValues) => envValues.MAIL_PROVIDER === MailProviderId.RESEND)
  @IsString()
  @IsNotEmpty()
  RESEND_API_KEY: string;

  @ValidateIf((envValues) => envValues.MAIL_PROVIDER === MailProviderId.RESEND)
  @IsUrl()
  @IsOptional()
  RESEND_BASE_URL: string;
}

export default registerAs<MailConfig>('mail', () => {
  console.info(`Register MailConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);

  const provider = process.env.MAIL_PROVIDER
    ? (process.env.MAIL_PROVIDER as MailProviderId)
    : MailProviderId.SMTP;

  return {
    provider,
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
    defaultName: process.env.MAIL_DEFAULT_NAME,
    smtp: {
      host: process.env.MAIL_HOST ?? 'localhost',
      port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD,
      ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
      secure: process.env.MAIL_SECURE === 'true',
      requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
    },
    resend: {
      apiKey: process.env.RESEND_API_KEY ?? '',
      baseUrl: process.env.RESEND_BASE_URL ?? 'https://api.resend.com',
    },
  };
});
