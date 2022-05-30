import { Module, forwardRef } from "@nestjs/common";
import { BoardController } from "./board.controller";
import { BoardService } from "./board.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Board, BoardSchema } from "./schemas/board.schema";
import { BoardRepository } from "./board.repository";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository],
  exports: [BoardRepository],
})
export class BoardModule {}
