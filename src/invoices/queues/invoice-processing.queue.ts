import { Queue, Worker } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class InvoiceProcessingQueue {
  private queue: Queue;
  private worker: Worker;
  private readonly logger = new Logger(InvoiceProcessingQueue.name);

  constructor(private prisma: PrismaService) {
    this.queue = new Queue('invoice-processing', {
      connection: {
        host: 'localhost',
        port: 6379
      }
    });

    this.worker = new Worker('invoice-processing', async job => {
      this.logger.log(`Processing job: ${job.id}`);
    
      try {
        // Simulate processing logic
        await this.processInvoice(job.data.id);

        return { success: true };
      } catch (error) {
        this.logger.error(`Job ${job.id} failed`, error);
        throw error;
      }
    }, {
      connection: {
        host: 'localhost',
        port: 6379
      }
    });
  }

  private async processInvoice(id: string) {
    // Simulate an async processing step
    // await new Promise(resolve => setTimeout(resolve, 2000));

    const newStatus = Math.random() > 0.5 ? InvoiceStatus.PAID : InvoiceStatus.CANCELLED ;

    // Update invoice status to PENDING
    const updatedInvoice = await this.prisma.invoice.update({
      where: { id },
      data: { 
        status: newStatus 
      }
    });
    
    // - Updating invoice status based on processing result
    this.logger.log(`Invoice ${id} processing completed`);
  }

  async addJob(invoiceData: any) {
    return this.queue.add('invoice-processing', invoiceData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      }
    });
  }
}