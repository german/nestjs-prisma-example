import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { InvoiceProcessingQueue } from './invoices/queues/invoice-processing.queue';
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
    InvoiceProcessingQueue
  ],
})
export class AppModule {}