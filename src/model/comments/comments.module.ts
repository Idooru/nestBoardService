import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Comments, CommentsSchema } from "./schemas/comments.schema";
import { CommentsController } from "./controller/comments.controller";
import { CommentsService } from "./service/comment.service";
import { CommentRepository } from "./comments.repository";
import { BoardModule } from "../board/board.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
    ]),
    forwardRef(() => BoardModule),
    forwardRef(() => UserModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository],
})
export class CommentModule {}
