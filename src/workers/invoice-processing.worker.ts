import { WorkerHost, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';

@Processor('invoice-processing')
export class InvoiceProcessingWorker extends WorkerHost {
  private readonly logger = new Logger(InvoiceProcessingWorker.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job): Promise<any> {
    this.logger.log(`Processing job: ${job.id}`);
    
    try {
      // Simulate processing logic
      await this.processInvoice(job.data);

      return { success: true };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed`, error);
      throw error;
    }
  }

  private async processInvoice(invoiceData: any) {
    this.logger.log(`Processing invoice: ${invoiceData.id}`);

    try {
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update invoice status (example)
      await this.prisma.invoice.update({
        where: { id: invoiceData.id },
        data: {
          status: InvoiceStatus.PAID,
          paidAt: new Date()
        }
      });

      this.logger.log(`Invoice ${invoiceData.id} processed successfully`);
    } catch (error) {
      this.logger.error(`Failed to process invoice ${invoiceData.id}`, error);
      throw error;
    }
  }
}