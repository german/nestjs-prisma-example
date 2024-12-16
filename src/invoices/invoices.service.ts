import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
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
    return this.prisma.invoice.create({
      data: {
        amount: new Decimal(createInvoiceDto.amount),
        status: InvoiceStatus.CREATED
      }
    });
  }

  async findAll() {
    return this.prisma.invoice.findMany();
  }

  async findOne(id: string) {
    return this.prisma.invoice.findUnique({ where: { id } });
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
      status: updatedInvoice.status
    });

    return updatedInvoice;
  }
}