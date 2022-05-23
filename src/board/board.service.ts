import { Injectable, UseFilters, HttpException } from "@nestjs/common";
import { CreateBoardDto } from "./dto/create-board.dto";
// import { UpdateBoardDto } from "./dto/update-board.dto";
import { Json } from "./interfaces/json.interface";
import { HttpExceptionFilter } from "../common/exception/http-exception.filter";
import { InjectModel } from "@nestjs/mongoose";
import { Board } from "./schemas/board.schema";
import { Model } from "mongoose";

@UseFilters(HttpExceptionFilter)
@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
  ) {}

  private async findBoardWithId(id: number): Promise<any> {
    const result = await this.boardModel.exists({ id });
    return result;
  }

  private isNotFound(board) {
    if (!board) {
      throw new HttpException("데이터베이스에 게시물이 없습니다.", 404);
    }
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Json> {
    const { title, description, isPublic } = createBoardDto;
    const board = await this.boardModel.create({
      title,
      description,
      isPublic,
    });

    return {
      statusCode: 201,
      success: true,
      message: "게시물이 생성되었습니다.",
      result: board,
    };
  }

  async findAllBoard(): Promise<Json> {
    const boards = await this.boardModel.find({});

    this.isNotFound(boards);

    return {
      statusCode: 200,
      success: true,
      message: "전체 게시물을 가져옵니다.",
      result: boards,
    };
  }

  // findOneBoard(id: number): Json {
  //   const found: Board = this.findBoardWithId(id);

  //   this.isNotFoundById(found);
  //   return {
  //     statusCode: 200,
  //     success: true,
  //     message: `${id}에 해당하는 게시물을 가져옵니다.`,
  //     result: found,
  //   };
  // }

  // updateBoard(id: number, updateBoardDto: UpdateBoardDto): Json {
  //   const { title, description, isPublic } = updateBoardDto;
  //   const found: Board = this.findBoardWithId(id);

  //   this.isNotFoundById(found);
  //   const idx = this.boards.indexOf(found);

  //   this.boards[idx].title = title;
  //   this.boards[idx].description = description;
  //   this.boards[idx].isPublic = isPublic;

  //   return {
  //     statusCode: 201,
  //     success: true,
  //     message: `${id}에 해당하는 게시물을 수정합니다.`,
  //   };
  // }

  // removeBoard(id: number) {
  //   const found: Board = this.findBoardWithId(id);

  //   this.isNotFoundById(found);
  //   this.boards = this.boards.filter((board) => board !== found);

  //   return {
  //     statusCode: 200,
  //     success: true,
  //     message: `${id}에 해당하는 게시물을 삭제합니다.`,
  //   };
  //}
}
