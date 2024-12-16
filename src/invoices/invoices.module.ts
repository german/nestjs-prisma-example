import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { InvoiceProcessor } from './invoice-processor';
import { BullModule } from '@nestjs/bullmq';
import { InvoiceProcessingQueue } from './queues/invoice-processing.queue';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'invoice-queue'
    })
  ],
  controllers: [InvoicesController],
  providers: [
    InvoicesService,
    InvoiceProcessor,
    InvoiceProcessingQueue
  ]
})

export class InvoicesModule {}