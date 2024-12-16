import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiResponse, 
  ApiOperation 
} from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { plainToClass } from '@nestjs/class-transformer';

@ApiTags('invoices')
@Controller('invoices')
@UseInterceptors(ClassSerializerInterceptor)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an invoice' })
  @ApiResponse({ status: 201, type: InvoiceResponseDto })
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<InvoiceResponseDto> {
    const invoice = await this.invoicesService.create(createInvoiceDto);
    return plainToClass(InvoiceResponseDto, invoice, { 
      excludeExtraneousValues: true 
    });
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process an invoice (move to PENDING status)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Invoice processed and enqueued', 
    type: InvoiceResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Invoice not found' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Invoice cannot be processed due to current status' 
  })
  processPendingInvoice(@Param('id') id: string) {
    return this.invoicesService.updateToPending(id);
  }

  @Get()
  @ApiOperation({ summary: 'List all invoices' })
  @ApiResponse({ status: 200, type: [InvoiceResponseDto] })
  async findAll(): Promise<InvoiceResponseDto[]> {
    const invoices = await this.invoicesService.findAll();
    return invoices.map(invoice => 
      plainToClass(InvoiceResponseDto, invoice, { 
        excludeExtraneousValues: true 
      })
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an invoice by ID' })
  @ApiResponse({ status: 200, type: InvoiceResponseDto })
  async findOne(@Param('id') id: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoicesService.findOne(id);
    return plainToClass(InvoiceResponseDto, invoice, { 
      excludeExtraneousValues: true 
    });
  }
}