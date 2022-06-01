import { Module, forwardRef } from "@nestjs/common";
import { BoardController } from "./board.controller";
import { BoardService } from "./board.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Board, BoardSchema } from "./schemas/board.schema";
import { BoardRepository } from "./repository/board.repository";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { ImageRepository } from "./repository/image.repository";
import { Image, ImageSchema } from "./schemas/image.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, ImageRepository],
  exports: [BoardRepository, ImageRepository],
})
export class BoardModule {}
