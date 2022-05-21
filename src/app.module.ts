import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { BoardModule } from "./board/board.module";
import { BoardController } from "./board/board.controller";
import { BoardService } from "./board/board.service";
import { ConfigModule } from "@nestjs/config";
import { LoggerMiddleware } from "./middlewares/logger.middleware";

@Module({
  imports: [ConfigModule.forRoot(), BoardModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
