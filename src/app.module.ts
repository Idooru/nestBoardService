import { MiddlewareConsumer, Module } from "@nestjs/common";
import { NestModule } from "@nestjs/common";
import { AuthModule } from "./model/auth/auth.module";
import { BoardModule } from "./model/board/board.module";
import { UserModule } from "./model/user/user.module";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "./lib/middlewares/logger.middleware";
import { CommentModule } from "./model/comments/comments.module";

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
    AuthModule,
    BoardModule,
    UserModule,
    CommentModule,
  ],
})
export class AppModule implements NestModule {
  private isDev: boolean = process.env.Mode === "dev" ? true : false;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
    mongoose.set("debug", this.isDev);
  }
}
