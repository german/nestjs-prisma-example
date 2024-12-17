import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceStatus } from '@prisma/client';
import { InvoiceProcessingQueue } from './queues/invoice-processing.queue';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private invoiceQueue: InvoiceProcessingQueue
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    // Validate amount explicitly
    if (!createInvoiceDto.amount || createInvoiceDto.amount <= 0) {
      throw new BadRequestException('Invalid invoice amount');
    }

    try {
      const invoice = await this.prisma.invoice.create({
        data: {
          amount: new Decimal(createInvoiceDto.amount),
          status: InvoiceStatus.CREATED
        }
      });

      return invoice;
    } catch (error) {
      // Log the error for debugging
      console.error('Invoice creation error:', error);
      throw new BadRequestException('Failed to create invoice');
    }
  }

  async findAll(): Promise<InvoiceResponseDto[]> {
    const invoices = await this.prisma.invoice.findMany();
    
    // Map Prisma results to response DTOs
    return invoices.map(invoice => 
      new InvoiceResponseDto({
        id: invoice.id,
        amount: Number(invoice.amount),
        status: invoice.status,
        createdAt: invoice.createdAt,
        paidAt: invoice.paidAt,
        cancelledAt: invoice.cancelledAt
      })
    );
  }

  async findOne(id: string): Promise<InvoiceResponseDto|null> {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });

    if(invoice) {
      return new InvoiceResponseDto({
        id: invoice.id,
        amount: Number(invoice.amount),
        status: invoice.status,
        createdAt: invoice.createdAt,
        paidAt: invoice.paidAt,
        cancelledAt: invoice.cancelledAt
      });
    } else {
      return null;
    }
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return this.prisma.invoice.update({
      where: { id },
      data: updateInvoiceDto
    });
  }

  async remove(id: string) {
    return this.prisma.invoice.delete({ where: { id } });
  }

  // Utility method to create a delay
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate a random delay between 1 and 5 seconds
  private getRandomDelay(): number {
    return Math.floor(Math.random() * 4000) + 1000; // 1000-5000 ms
  }

  async updateToPending(id: string) {
    // Find the invoice first
    const existingInvoice = await this.prisma.invoice.findUnique({ 
      where: { id } 
    });

    // Check if invoice exists
    if (!existingInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    // Check if invoice is in CREATED status
    if (existingInvoice.status !== InvoiceStatus.CREATED) {
      throw new ConflictException(`Invoice ${id} cannot be moved to PENDING. Current status: ${existingInvoice.status}`);
    }

    // Generate a random delay
    const delayDuration = this.getRandomDelay();

    // Introduce the delay
    await this.delay(delayDuration);

    // Update invoice status to PENDING
    const updatedInvoice = await this.prisma.invoice.update({
      where: { id },
      data: { 
        status: InvoiceStatus.PENDING 
      }
    });

    // Enqueue the invoice for processing
    await this.invoiceQueue.addJob({
      id: updatedInvoice.id,
      amount: updatedInvoice.amount,
      status: updatedInvoice.status,
      delayApplied: delayDuration
    });

    return {
      ...updatedInvoice,
      processingDelay: delayDuration
    };
  }
}