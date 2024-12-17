import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsDate } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class InvoiceResponseDto {
  @ApiProperty()
  @Expose()
  @IsString()
  id: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: InvoiceStatus })
  @Expose()
  status: InvoiceStatus = InvoiceStatus.CREATED;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  paidAt?: Date | null;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  cancelledAt?: Date | null;

  constructor(partial: Partial<InvoiceResponseDto> = {}) {
    Object.assign(this, partial);
  }
}

/*
import { PickType } from '@nestjs/swagger';
import { Invoice } from '../entities/invoice.entity';
import { InvoiceStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class InvoiceResponseDto extends PickType(Invoice, [
  'id', 
  'amount', 
  'status', 
  'createdAt'
] as const) {
  // Add a constructor to satisfy TypeScript's strict initialization checks
  constructor(
    id: string, 
    amount: Decimal, 
    status: InvoiceStatus, 
    createdAt: Date
  ) {
    super();
    this.id = id;
    this.amount = amount;
    this.status = status;
    this.createdAt = createdAt;
  }
}*/