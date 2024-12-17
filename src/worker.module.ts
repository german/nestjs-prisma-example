import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaService } from './prisma/prisma.service';
import { InvoiceProcessingQueue } from './invoices/queues/invoice-processing.queue';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379
      }
    }),
    BullModule.registerQueue({
      name: 'invoice-processing'
    })
  ],
  providers: [
    PrismaService,
    InvoiceProcessingQueue
  ]
})
export class WorkerModule {}