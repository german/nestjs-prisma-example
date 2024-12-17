import { Invoice as PrismaInvoice, InvoiceStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class Invoice implements PrismaInvoice {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: Decimal;

  @ApiProperty({ enum: InvoiceStatus })
  status: InvoiceStatus;

  @ApiProperty({ required: false, nullable: true })
  paidAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  cancelledAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<Invoice> = {}) {
    Object.assign(this, partial);
  }
}
