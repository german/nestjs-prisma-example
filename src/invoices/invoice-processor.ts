import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InvoicesService } from './invoices.service';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceStatus } from '@prisma/client';

@Processor('invoice-queue')
export class InvoiceProcessor extends WorkerHost {
  constructor(private invoicesService: InvoicesService) {
    super();
  }

  async process(job: Job) {
    const { id, action } = job.data;

    try {
      switch(action) {
        case 'process':
          await this.invoicesService.update(id, { 
            status: InvoiceStatus.PENDING 
          } as UpdateInvoiceDto);
          break;
        case 'complete':
          await this.invoicesService.update(id, { 
            status: InvoiceStatus.PAID,
            paidAt: new Date()
          } as UpdateInvoiceDto);
          break;
        case 'cancel':
          await this.invoicesService.update(id, { 
            status: InvoiceStatus.CANCELLED,
            cancelledAt: new Date()
          } as UpdateInvoiceDto);
          break;
      }
    } catch (error) {
      // Type guard to check if error is an Error object
      const errorMessage = error instanceof Error 
        ? error.message 
        : String(error);
      
      throw new Error(`Failed to process invoice ${id}: ${errorMessage}`);
    }
  }
}