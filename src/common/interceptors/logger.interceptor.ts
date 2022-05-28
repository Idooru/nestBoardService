import {
  Injectable,
  NestInterceptor,
  CallHandler,
  Logger,
  ArgumentsHost,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "@nestjs/common";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private logger = new Logger("HTTP");

  intercept(context: ArgumentsHost, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    this.logger.log(`Request to ${req.method} ${req.url}`);
    return next.handle().pipe(
      tap((data) =>
        this.logger.log(
          `Response from ${req.method} ${req.url} \n response: 
            ${res.statusText} ${JSON.stringify(data)}`,
        ),
      ),
    );
  }
}
