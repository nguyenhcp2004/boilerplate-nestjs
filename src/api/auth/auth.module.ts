import { emailQueueRegistration } from '@/background/queues/email-queue/email-queue.module';
import type { IEmailJob } from '@/common/interfaces/job.interface';
import type { AllConfigType } from '@/config/config.type';
import { QueueName } from '@/constants/job.constant';
import { getQueueToken } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import type { Queue } from 'bullmq';
import { UserEntity } from '../user/entities/user.entity';
import { createAuth } from './auth';

@Module({
  imports: [
    // The auth instance must be built inside DI: ConfigModule.forRoot loads
    // .env when the container initializes, and betterAuth(...) eagerly opens
    // its Redis/Postgres connections at construction. A module-scope
    // instance would read a not-yet-populated process.env (NaN ports,
    // missing social credentials).
    BetterAuthModule.forRootAsync({
      // Async providers resolve their inject list against these imports
      // only, so both ConfigService and the email queue must be provided
      // here — not in the surrounding AuthModule.
      imports: [ConfigModule, emailQueueRegistration],
      inject: [ConfigService, getQueueToken(QueueName.EMAIL)],
      useFactory: (
        configService: ConfigService<AllConfigType>,
        emailQueue: Queue<IEmailJob>,
      ) => ({
        auth: createAuth(configService, emailQueue),
        // Re-adds the body parsers disabled in main.ts (bodyParser: false),
        // required so better-auth receives the raw request body.
        bodyParser: {
          json: { limit: '2mb' },
          urlencoded: { limit: '2mb', extended: true },
          rawBody: true,
        },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class AuthModule {}
