import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "./schemas/comment.schema";
import { CommentController } from "./controller/comment.controller";
import { CommentService } from "./service/comment.service";
import { CommentRepository } from "./comment.repository";
import { BoardModule } from "../board/board.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    BoardModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
