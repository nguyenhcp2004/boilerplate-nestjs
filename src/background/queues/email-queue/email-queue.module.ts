import { QueueName, QueuePrefix } from '@/constants/job.constant';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { EmailQueueEvents } from './email-queue.events';
import { EmailQueueService } from './email-queue.service';
import { EmailProcessor } from './email.processor';

/**
 * Shared registration for the email queue. Imported both by this module and
 * by AuthModule's BetterAuthModule.forRootAsync — the latter injects the
 * queue into createAuth, and async providers only resolve their inject
 * list against the dynamic module's own imports.
 */
export const emailQueueRegistration = BullModule.registerQueue({
  name: QueueName.EMAIL,
  prefix: QueuePrefix.AUTH,
  streams: {
    events: {
      maxLen: 1000,
    },
  },
});

@Module({
  imports: [emailQueueRegistration],
  providers: [EmailQueueService, EmailProcessor, EmailQueueEvents],
})
export class EmailQueueModule {}
