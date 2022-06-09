import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./lib/exception/http-exception.filter";
import { NestExpressApplication } from "@nestjs/platform-express";

import * as cookieParser from "cookie-parser";
import * as path from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT;

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());

  app.useStaticAssets(path.join(__dirname, "../uploads/image"), {
    prefix: "/media",
  });

  app.listen(port, () =>
    console.log(`Server is running at http://localhost:${port}`),
  );
}

bootstrap();
