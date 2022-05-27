import { MiddlewareConsumer, Module } from "@nestjs/common";
import { NestModule } from "@nestjs/common";
import { LoggerMiddleware } from "./common/middlewares/logger.middleware";
import { AuthModule } from "./modules/auth/auth.module";
import { BoardModule } from "./modules/board/board.module";
import { UserModule } from "./modules/user/user.module";
import { ConfigModule } from "@nestjs/config";

import * as mongoose from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    AuthModule,
    BoardModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  private isDev: boolean = process.env.Mode === "dev" ? true : false;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
    mongoose.set("debug", this.isDev);
  }
}
