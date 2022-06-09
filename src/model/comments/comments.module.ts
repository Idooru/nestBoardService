import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentsSchema } from "./schemas/comments.schema";
import { CommentsController } from "./controller/comments.controller";
import { CommentsService } from "./service/comment.service";
import { CommentRepository } from "./comments.repository";
import { BoardModule } from "../board/board.module";
import { UserModule } from "../user/user.module";
import { ValidatorModule } from "../../lib/validator/validator.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "comments", schema: CommentsSchema }]),
    forwardRef(() => BoardModule),
    forwardRef(() => UserModule),
    forwardRef(() => ValidatorModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository],
  exports: [CommentRepository],
})
export class CommentModule {}
