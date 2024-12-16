import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { InvoicesModule } from './invoices/invoices.module';
// import { UsersModule } from './users/users.module';
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
    SwaggerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}