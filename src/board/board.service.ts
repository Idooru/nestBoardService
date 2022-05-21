import { Injectable, UseFilters, HttpException } from "@nestjs/common";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { Board } from "./interfaces/board.interface";
import { Json } from "./interfaces/json.interface";
import { HttpExceptionFilter } from "../exception/http-exception.filter";

@UseFilters(HttpExceptionFilter)
@Injectable()
export class BoardService {
  private board: Board[] = [];

  createBoard(createBoardDto: CreateBoardDto): Json {
    const { title, description, isOpen } = createBoardDto;
    const board: Board = {
      id: Date.now().toString(),
      title,
      description,
      isOpen,
    };

    this.board.push(board);

    return {
      statusCode: 201,
      success: true,
      message: "Create board",
      result: board,
    };
  }

  findAllBoard() {
    throw new HttpException("sorry mate", 404);
  }

  findOneBoard(id: number) {
    return `This action returns a #${id} board`;
  }

  updateBoard(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  removeBoard(id: number) {
    return `This action removes a #${id} board`;
  }
}
