import type { EmailQueueSender } from '@/api/auth/auth';
import { bindEmailQueueSender } from '@/api/auth/auth';
import type { IEmailJob } from '@/common/interfaces/job.interface';
import { JobName, QueueName } from '@/constants/job.constant';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import type { Queue } from 'bullmq';

/**
 * Binds the Nest-managed BullMQ email queue into the module-scope better-auth
 * instance (src/api/auth/auth.ts). The better-auth email callbacks enqueue
 * through this bridge instead of importing the queue directly, because the
 * auth instance is created before the DI container exists.
 */
@Injectable()
export class EmailQueueBridge implements OnModuleInit, EmailQueueSender {
  private readonly logger = new Logger(EmailQueueBridge.name);

  constructor(
    @InjectQueue(QueueName.EMAIL)
    private readonly emailQueue: Queue<IEmailJob>,
  ) {}

  onModuleInit(): void {
    bindEmailQueueSender(this);
    this.logger.debug('Email queue bridge bound to better-auth instance');
  }

  add(
    jobName: JobName,
    data: IEmailJob,
    opts?: { attempts?: number; backoff?: { type: string; delay: number } },
  ): Promise<unknown> {
    return this.emailQueue.add(jobName, data, opts);
  }
}
