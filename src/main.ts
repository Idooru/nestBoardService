import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./lib/exception/http-exception.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT;

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser(process.env.COOKIE_SECRET));

  app.useStaticAssets(join(__dirname, "../uploads/image"), {
    prefix: "/media",
  });

  app.listen(port, () =>
    console.log(`Server is running at http://localhost:${port}`),
  );
}

bootstrap();
// work on wsl ubuntu 22-04
