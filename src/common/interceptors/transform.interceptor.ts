import { 
  Injectable, 
  NestInterceptor, 
  ExecutionContext, 
  CallHandler 
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InvoiceResponseDto } from '../../invoices/dto/invoice-response.dto';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // If data is an array, transform each item
        if (Array.isArray(data)) {
          return data.map(item => this.transformItem(item));
        }
        
        // If single item, transform the item
        return this.transformItem(data);
      })
    );
  }

  private transformItem(item: any) {
    // If item is null or undefined, return as is
    if (!item) return item;

    // Use plainToInstance to properly transform the object
    return plainToInstance(InvoiceResponseDto, item, {
      excludeExtraneousValues: true, // Only transform properties with @Expose()
      enableImplicitConversion: true,
    });
  }
}