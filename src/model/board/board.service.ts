import {
  Injectable,
  UseFilters,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { Json } from "../../common/interfaces/json.interface";
import { HttpExceptionFilter } from "../../common/exception/http-exception.filter";
import { InjectModel } from "@nestjs/mongoose";
import { Board } from "./schemas/board.schema";
import { Model } from "mongoose";

@UseFilters(HttpExceptionFilter)
@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
  ) {}

  private async findBoardWithId(id: string): Promise<Board> {
    return await this.boardModel.findById(id);
  }

  private isNotFoundwithFindOne(board: Board, id: string): void {
    if (!board) {
      throw new NotFoundException(
        `데이터베이스에 id(${id})에 해당하는 게시물이 없습니다.`,
      );
    }
  }

  private isNotFoundwithFindAll(boards: Board[]): void {
    if (!boards.length) {
      throw new NotFoundException("데이터베이스에 게시물이 하나도 없습니다.");
    }
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Json> {
    const { title, description, isPublic } = createBoardDto;
    const isBoardTitleExist = await this.boardModel.exists({ title });

    if (isBoardTitleExist) {
      throw new UnauthorizedException("게시물이 이미 존재합니다.");
    }

    const board = await this.boardModel.create({
      title,
      description,
      isPublic,
    });

    return {
      statusCode: 201,
      message: "게시물이 생성되었습니다.",
      result: board,
    };
  }

  async findAllBoard(): Promise<Json> {
    const boards: Board[] = await this.boardModel.find({});

    this.isNotFoundwithFindAll(boards);

    return {
      statusCode: 200,
      message: "전체 게시물을 가져옵니다.",
      result: boards,
    };
  }

  async findOneBoard(id: string): Promise<Json> {
    const board: Board = await this.findBoardWithId(id);

    this.isNotFoundwithFindOne(board, id);

    return {
      statusCode: 200,
      message: `${id}에 해당하는 게시물을 가져옵니다.`,
      result: board,
    };
  }

  async updateBoard(id: string, updateBoardDto: UpdateBoardDto): Promise<Json> {
    const { title, description, isPublic } = updateBoardDto;
    const board: Board = await this.findBoardWithId(id);

    this.isNotFoundwithFindOne(board, id);
    await this.boardModel.updateOne(
      {
        _id: id,
      },
      {
        title,
        description,
        isPublic,
      },
    );

    return {
      statusCode: 201,
      message: `${id}에 해당하는 게시물을 수정합니다.`,
    };
  }

  async removeBoard(id: string) {
    const board: Board = await this.findBoardWithId(id);

    this.isNotFoundwithFindOne(board, id);
    await this.boardModel.deleteOne({ _id: id }, {});

    return {
      statusCode: 200,
      message: `${id}에 해당하는 게시물을 삭제합니다.`,
    };
  }
}
