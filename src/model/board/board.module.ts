import { Module, forwardRef } from "@nestjs/common";
import { BoardController } from "./board.controller";
import { BoardService } from "./board.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BoardSchema } from "./schemas/board.schema";
import { BoardRepository } from "./repository/board.repository";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { ImageRepository } from "./repository/image.repository";
import { ImageSchema } from "./schemas/image.schema";
import { CommentsSchema } from "../comments/schemas/comments.schema";
import { CommentModule } from "../comments/comments.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "boards", schema: BoardSchema },
      { name: "images", schema: ImageSchema },
      { name: "comments", schema: CommentsSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => CommentModule),
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, ImageRepository],
  exports: [BoardRepository, ImageRepository],
})
export class BoardModule {}
