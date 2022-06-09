import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { HttpError } from "../interfaces/http-error.interface";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse() as HttpError;

    console.log(
      `Response from ${req.method} ${req.originalUrl} :: error detected`,
    );

    res.status(status).json({
      error: {
        statusCode: status,
        timestamp: new Date().toString(),
        ...error,
      },
    });
  }
}
