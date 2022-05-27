import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/exception/http-exception.filter";
import { JwtGuard } from "./modules/auth/jwt/jwt.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(new JwtGuard());

  app.listen(port, () =>
    console.log(`Server is running at http://localhost:${port}`),
  );
}

bootstrap();
