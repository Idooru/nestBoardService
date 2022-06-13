import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";

import { HttpError } from "../interfaces/http-error.interface";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    const status = exception.getStatus();
    const error = exception.getResponse() as HttpError;

    console.error(error);

    res
      .status(status)
      .setHeader("X-Powered-By", "")
      .json({
        error: {
          statusCode: status,
          timestamp: new Date().toString(),
          ...error,
        },
      });
  }
}
