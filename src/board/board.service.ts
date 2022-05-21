import { Injectable, UseFilters, HttpException } from "@nestjs/common";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { Board } from "./interfaces/board.interface";
import { Json } from "./interfaces/json.interface";
import { HttpExceptionFilter } from "../exception/http-exception.filter";

@UseFilters(HttpExceptionFilter)
@Injectable()
export class BoardService {
  private boards: Board[] = [];

  private findBoardWithId(id: number): Board {
    return this.boards.find((board) => board.id === id);
  }

  private isNotFoundById(board: Board) {
    if (!board) {
      throw new HttpException("데이터베이스에 게시물이 없습니다.", 404);
    }
  }

  createBoard(createBoardDto: CreateBoardDto): Json {
    const { title, description, isOpen } = createBoardDto;
    const board: Board = {
      id: Date.now(),
      title,
      description,
      isOpen,
    };

    this.boards.push(board);

    return {
      statusCode: 201,
      success: true,
      message: "게시물이 생성되었습니다.",
      result: board,
    };
  }

  findAllBoard(): Json {
    if (!this.boards.length) {
      throw new HttpException("데이터베이스에 게시물이 없습니다.", 404);
    }

    return {
      statusCode: 200,
      success: true,
      message: "전체 게시물을 가져옵니다.",
      result: this.boards,
    };
  }

  findOneBoard(id: number): Json {
    const found: Board = this.findBoardWithId(id);

    this.isNotFoundById(found);
    return {
      statusCode: 200,
      success: true,
      message: `${id}에 해당하는 게시물을 가져옵니다.`,
      result: found,
    };
  }

  updateBoard(id: number, updateBoardDto: UpdateBoardDto): Json {
    const { title, description, isOpen } = updateBoardDto;
    const found: Board = this.findBoardWithId(id);

    this.isNotFoundById(found);
    const idx = this.boards.indexOf(found);

    this.boards[idx].title = title;
    this.boards[idx].description = description;
    this.boards[idx].isOpen = isOpen;

    return {
      statusCode: 201,
      success: true,
      message: `${id}에 해당하는 게시물을 수정합니다.`,
    };
  }

  removeBoard(id: number) {
    const found: Board = this.findBoardWithId(id);

    this.isNotFoundById(found);
    this.boards = this.boards.filter((board) => board !== found);

    return {
      statusCode: 200,
      success: true,
      message: `${id}에 해당하는 게시물을 삭제합니다.`,
    };
  }
}
