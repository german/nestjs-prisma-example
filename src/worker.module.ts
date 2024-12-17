import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaService } from './prisma/prisma.service';
import { InvoiceProcessingWorker } from './workers/invoice-processing.worker';

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
    InvoiceProcessingWorker
  ]
})
export class WorkerModule {}