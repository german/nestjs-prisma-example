import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ type: 'number', description: 'Invoice amount' })
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number = 0.0;
}