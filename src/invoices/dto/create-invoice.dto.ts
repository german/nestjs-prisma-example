import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNumber, 
  IsPositive, 
  IsNotEmpty, 
  Min, 
  Max,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @ApiProperty({ 
    description: 'Invoice amount', 
    type: 'number', 
    minimum: 0.01,
    maximum: 1000000,
    example: 100.50 
  })
  @IsNotEmpty({ message: 'Amount cannot be empty' })
  @IsNumber({ 
    maxDecimalPlaces: 2,
    allowNaN: false,
    allowInfinity: false
  }, { message: 'Amount must be a valid number' })
  @Min(0.01, { message: 'Minimum amount is 0.01' })
  @Max(1000000, { message: 'Maximum amount is 1,000,000' })
  @Type(() => Number)
  amount: number = 0.0;
}