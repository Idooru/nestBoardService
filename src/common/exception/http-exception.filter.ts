import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import { HttpError } from "./http-error.interface";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error: HttpError = exception.getResponse() as {
      statusCode: number;
      message: string;
      id?: string;
      error: string;
    };

    res.status(status).json({
      error: {
        statusCode: status,
        timestamp: new Date().toString(),
        ...error,
      },
    });
  }
}
