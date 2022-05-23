import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { BoardModule } from "./model/board/board.module";
import { ConfigModule } from "@nestjs/config";
import { LoggerMiddleware } from "./common/middlewares/logger.middleware";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./model/user/user.module";
import * as mongoose from "mongoose";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    BoardModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === "dev" ? true : false;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
    mongoose.set("debug", this.isDev);
  }
}
