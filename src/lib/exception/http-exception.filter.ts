import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { HttpError } from "../interfaces/http-error.interface";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger("Error");

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse() as HttpError;

    this.logger.log(error);

    res.status(status).json({
      error: {
        statusCode: status,
        timestamp: new Date().toString(),
        ...error,
      },
    });
  }
}
