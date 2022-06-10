import {
  CallHandler,
  ArgumentsHost,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
export class JsonResponseInterceoptor implements NestInterceptor {
  intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    console.log(`Request from ${req.method} ${req.originalUrl} ...`);
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        console.log(
          `Response from ${req.method} ${req.originalUrl} :: time taken : ${
            Date.now() - now
          }ms`,
        );
        res.setHeader("X-Powered-By", "").status(data.statusCode).json(data);
      }),
    );
  }
}
