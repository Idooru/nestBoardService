import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { BoardService } from "./board.service";
import { BoardRequestDto } from "./dto/board-request.dto";
import { Json } from "../../common/interfaces/json.interface";

@Controller("board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  createBoard(@Body() boardRequestDto: BoardRequestDto): Promise<Json> {
    return this.boardService.createBoard(boardRequestDto);
  }

  @Get()
  findAllBoard(): Promise<Json> {
    return this.boardService.findAllBoard();
  }

  @Get(":id/id")
  findOneBoard(@Param("id") id: string): Promise<Json> {
    return this.boardService.findOneBoard(id);
  }

  @Patch(":id/id")
  async updateBoard(
    @Param("id") id: string,
    @Body() boardRequestDto: BoardRequestDto,
  ): Promise<Json> {
    return await this.boardService.updateBoard(id, boardRequestDto);
  }

  @Delete(":id/id")
  removeBoard(@Param("id") id: string) {
    return this.boardService.removeBoard(id);
  }
}
