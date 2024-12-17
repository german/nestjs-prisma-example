import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { InvoiceProcessingWorker } from './workers/invoice-processing.worker';
import { InvoicesModule } from './invoices/invoices.module';
import { BullModule } from '@nestjs/bullmq';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    InvoicesModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379
      }
    }),
    BullModule.registerQueue({
      name: 'invoice-processing'
    }),
    SwaggerModule
  ],
  controllers: [],
  providers: [
    PrismaService,
    InvoiceProcessingWorker
  ],
})
export class AppModule {}