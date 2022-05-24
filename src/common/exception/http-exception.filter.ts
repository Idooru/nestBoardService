import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | { error: string; message: string; statusCode: number | string[] };

    if (typeof error === "string") {
      res.status(status).json({
        success: false,
        statusCode: status,
        timestamp: new Date().toString(),
        path: req.originalUrl,
        error,
      });
    } else {
      res.status(status).json({
        success: false,
        statusCode: status,
        timestamp: new Date().toString(),
        ...error,
      });
    }
  }
}
