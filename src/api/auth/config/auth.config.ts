import validateConfig from '@/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { AuthConfig } from './auth-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  BETTER_AUTH_SECRET: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  BETTER_AUTH_URL: string;

  @IsString()
  @IsNotEmpty()
  AUTH_GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  AUTH_GOOGLE_CLIENT_SECRET: string;
}

export default registerAs<AuthConfig>('auth', () => {
  console.info(`Register AuthConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
    googleClientId: process.env.AUTH_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
  };
});
