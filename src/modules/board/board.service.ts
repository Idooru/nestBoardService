import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { BoardRequestDto } from "./dto/board-request.dto";
import { Json } from "../../common/interfaces/json.interface";
import { Board } from "./schemas/board.schema";
import { BoardRepository } from "./board.repository";

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {
    this.boardRepository = boardRepository;
  }

  private async isExistId(id: string): Promise<void> {
    const found: boolean = await this.boardRepository.existBoardId(id);

    if (!found) {
      throw new BadRequestException(`유효하지 않은 id입니다. id: {${id}}`);
    }
  }

  async createBoard(payload: BoardRequestDto): Promise<Json> {
    console.time("create board");
    parseInt("asd");
    const { title, writer, description, isPublic } = payload;
    const found = await this.boardRepository.existBoardTitle(title);

    if (found) {
      throw new ForbiddenException("게시물이 이미 존재합니다.");
    }

    const board: Board = await this.boardRepository.create({
      title,
      writer,
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
      throw new NotFoundException("데이터베이스에 게시물이 하나도 없습니다.");
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

  async updateBoard(id: string, payload: BoardRequestDto): Promise<Json> {
    console.time(`update board by ${id}`);

    const { title, writer, description, isPublic } = payload;

    await this.isExistId(id);
    await this.boardRepository.update(id, {
      title,
      writer,
      description,
      isPublic,
    });

    console.timeEnd(`update board by ${id}`);

    return {
      statusCode: 201,
      message: `${id}에 해당하는 게시물을 수정하였습니다.`,
    };
  }

  async removeBoard(id: string): Promise<Json> {
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
