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
  ParseIntPipe,
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
  findAllBoard(): Json {
    return this.boardService.findAllBoard();
  }

  @Get(":id/id")
  findOneBoard(@Param("id", ParseIntPipe) id: number): Json {
    return this.boardService.findOneBoard(id);
  }

  @Patch(":id/id")
  updateBoard(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Json {
    return this.boardService.updateBoard(id, updateBoardDto);
  }

  @Delete(":id/id")
  removeBoard(@Param("id", ParseIntPipe) id: number) {
    return this.boardService.removeBoard(id);
  }
}
