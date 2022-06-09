import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
import { AuthModule } from "../auth/auth.module";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";
import { UserRepository } from "./user.repository";
import { BoardModule } from "../board/board.module";
import { CommentModule } from "../comments/comments.module";
import { ValidatorModule } from "../../lib/validator/validator.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "users", schema: UserSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => BoardModule),
    forwardRef(() => CommentModule),
    forwardRef(() => ValidatorModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
