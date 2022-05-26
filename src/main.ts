import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/exception/http-exception.filter";
import { JsonSuccessInterceptor } from "./common/interceptors/json-success.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new JsonSuccessInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () =>
    console.log(`Server is running at http://localhost:${port}`),
  );
}
bootstrap();
