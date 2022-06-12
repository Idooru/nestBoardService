import { Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
      const { ip, originalUrl, method } = req;
      const { statusCode, statusMessage } = res;
      const logger = new Logger("HTTP");

      if (400 <= statusCode || statusCode >= 599) {
        const logger = new Logger("Error");
        return logger.error(`${req.method} ${req.originalUrl} error detected`);
      }

      return logger.log(
        `${method} ${originalUrl} ${ip} - ${statusCode} ${statusMessage}`,
        originalUrl,
      );
    });
    next();
  }
}
