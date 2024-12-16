import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class InvoiceResponseDto {
  @ApiProperty()
  @Expose()
  id: string = '';

  @ApiProperty()
  @Expose()
  amount: number = 0.0;

  @ApiProperty({ enum: InvoiceStatus })
  @Expose()
  status: InvoiceStatus = InvoiceStatus.CREATED;

  @ApiProperty({ required: false })
  @Expose()
  paidAt?: Date;

  @ApiProperty({ required: false })
  @Expose()
  cancelledAt?: Date;
}