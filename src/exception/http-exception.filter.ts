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
    typeof error === "string"
      ? res.status(status).json({
          statusCode: status,
          success: false,
          timestamp: new Date().toString(),
          path: req.originalUrl,
          error,
        })
      : res.status(status).json({
          statusCode: status,
          success: false,
          timestamp: new Date().toString(),
          ...error,
        });
  }
}

// const error = exception.getResponse() as
// | string
// | { statusCode: number; message: string; error: string | string[] };

// typeof error === "string"
// ? response.status(status).json({
//     statusCode: status,
//     success: false,
//     timestamp: new Date().toISOString(),
//     path: request.url,
//     error,
//   })
// : response.status(status).json({
//     statusCode: status,
//     success: false,
//     timestamp: new Date().toISOString(),
//     ...error,
//   });
// }
