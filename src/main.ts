import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    whitelist: true 
  }));

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Invoice Management API')
    .setDescription('API for managing invoices')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Bind Swagger to /swagger path
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
