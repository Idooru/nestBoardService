import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { BoardService } from "./board.service";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { Json } from "./interfaces/json.interface";

@UsePipes(ValidationPipe)
@Controller("board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  createBoard(@Body() createBoardDto: CreateBoardDto): Json {
    return this.boardService.createBoard(createBoardDto);
  }

  @Get()
  findAllBoard() {
    return this.boardService.findAllBoard();
  }

  @Get(":id")
  findOneBoard(@Param("id") id: string) {
    return this.boardService.findOneBoard(+id);
  }

  @Patch(":id")
  updateBoard(@Param("id") id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.updateBoard(+id, updateBoardDto);
  }

  @Delete(":id")
  removeBoard(@Param("id") id: string) {
    return this.boardService.removeBoard(+id);
  }
}
