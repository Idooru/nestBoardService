import { Injectable, UseFilters, HttpException } from "@nestjs/common";
import { BoardRequestDto } from "./dto/board-request.dto";
import { Json } from "../../common/interfaces/json.interface";
import { HttpExceptionFilter } from "../../common/exception/http-exception.filter";
import { Board } from "./schemas/board.schema";
import { BoardRepository } from "./board.repository";

@UseFilters(HttpExceptionFilter)
@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  private async isExistId(id: string) {
    const found: boolean = await this.boardRepository.existBoardId(id);

    if (found) {
      throw new HttpException(`유효하지 않은 ${id}입니다.`, 402);
    }
  }

  async createBoard(boardRequestDto: BoardRequestDto): Promise<Json> {
    console.time("create board");

    const { title, description, isPublic } = boardRequestDto;
    const found = await this.boardRepository.existBoardTitle(title);

    if (found) {
      throw new HttpException("게시물이 이미 존재합니다.", 403);
    }

    const board: Board = await this.boardRepository.create({
      title,
      description,
      isPublic,
    });

    console.timeEnd("create board");

    return {
      statusCode: 201,
      message: "게시물이 생성되었습니다.",
      result: board.readOnlyData,
    };
  }

  async findAllBoard(): Promise<Json> {
    console.time("find all board");

    const boards: Board[] = await this.boardRepository.findBoards();

    if (!boards.length) {
      throw new HttpException("데이터베이스에 게시물이 하나도 없습니다.", 404);
    }

    console.timeEnd("find all board");

    return {
      statusCode: 200,
      message: "전체 게시물을 가져왔습니다.",
      result: boards,
    };
  }

  async findOneBoard(id: string): Promise<Json> {
    console.time(`find one board by ${id}`);

    await this.isExistId(id);
    const board: Board = await this.boardRepository.findBoardWithId(id);

    console.timeEnd(`find one board by ${id}`);

    return {
      statusCode: 200,
      message: `${id}에 해당하는 게시물을 가져왔습니다.`,
      result: board.readOnlyData,
    };
  }

  async updateBoard(
    id: string,
    boardRequestDto: BoardRequestDto,
  ): Promise<Json> {
    console.time(`update board by ${id}`);

    const { title, description, isPublic } = boardRequestDto;

    await this.isExistId(id);
    await this.boardRepository.update(id, { title, description, isPublic });

    console.timeEnd(`update board by ${id}`);

    return {
      statusCode: 201,
      message: `${id}에 해당하는 게시물을 수정하였습니다.`,
    };
  }

  async removeBoard(id: string) {
    console.time(`remove board by ${id}`);

    await this.isExistId(id);
    await this.boardRepository.delete(id);

    console.timeEnd(`remove board by ${id}`);

    return {
      statusCode: 200,
      message: `${id}에 해당하는 게시물을 삭제하였습니다.`,
    };
  }
}
