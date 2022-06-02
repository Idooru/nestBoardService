import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { BoardRequestDto } from "./dto/board-request.dto";
import { Json } from "../../lib/interfaces/json.interface";
import { Board } from "./schemas/board.schema";
import { BoardRepository } from "./repository/board.repository";
import { JwtPayload } from "../auth/jwt/jwt-payload.interface";
import { UserRepository } from "../user/user.repository";
import { ImageRepository } from "./repository/image.repository";

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly imageRepository: ImageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  private async isExistId(id: string): Promise<void> {
    const found: boolean = await this.boardRepository.existBoardId(id);

    if (!found) {
      throw new NotFoundException(`유효하지 않은 id입니다. id: {${id}}`);
    }
  }

  private async isExistName(name: string): Promise<void> {
    const found: boolean = await this.userRepository.existUserName(name);

    if (!found) {
      throw new NotFoundException(`유효하지 않은 name입니다. name: {${name}}`);
    }
  }

  async createBoard(payload: BoardRequestDto, user: JwtPayload): Promise<Json> {
    console.time("create board");

    const { title, description, isPublic } = payload;

    const author = user.name;
    const now = Date().replace("GMT+0900 (대한민국 표준시)", "");

    const board: Board = await this.boardRepository.create({
      title,
      author,
      description,
      isPublic,
      whenCreated: now,
    });

    console.timeEnd("create board");

    return {
      statusCode: 201,
      message: "게시물이 생성되었습니다.",
      result: board.readOnlyDataSingle,
    };
  }

  async uploadImg(
    files: Array<Express.Multer.File>,
    user: JwtPayload,
  ): Promise<Json> {
    console.time("upload image");

    const imgUrls: Array<string[]> = [];
    const author = user.name;

    if (!files.length) {
      throw new BadRequestException(
        "사진을 업로드 할 수 없습니다. 사진을 제시해주세요.",
      );
    } else if (files.length >= 2) {
      for (const index of files) {
        const fileName = index.filename;
        const originalName = index.originalname;
        imgUrls.push(
          await this.imageRepository.uploadImg({
            fileName,
            author,
            originalName,
          }),
        );
      }
    } else {
      const fileName = files[0].filename;
      const originalName = files[0].originalname;
      imgUrls.push(
        await this.imageRepository.uploadImg({
          fileName,
          author,
          originalName,
        }),
      );
    }

    console.timeEnd("upload image");

    return {
      statusCode: 201,
      message: "사진을 업로드 하였습니다.",
      result: imgUrls,
    };
  }

  async findAllBoards(): Promise<Json> {
    console.time("find all board");

    const boards: Board[] = await this.boardRepository.findBoards();

    if (!boards.length) {
      throw new NotFoundException("데이터베이스에 게시물이 하나도 없습니다.");
    }

    const readOnlyBoards = boards
      .filter((idx) => idx.isPublic)
      .map((idx) => idx.readOnlyDataMultiple);

    console.timeEnd("find all boards");

    return {
      statusCode: 200,
      message: "전체 게시물을 가져왔습니다.",
      result: readOnlyBoards,
    };
  }

  async findOneBoardWithId(id: string): Promise<Json> {
    console.time(`find one board with ${id}`);

    await this.isExistId(id);
    const board: Board = await this.boardRepository.findBoardWithId(id);

    console.timeEnd(`find one board with ${id}`);

    return {
      statusCode: 200,
      message: `${id}에 해당하는 게시물을 가져왔습니다.`,
      result: board.readOnlyDataSingle,
    };
  }

  async findAllBoardsWithAuthorName(name: string): Promise<Json> {
    console.time(`find boards with ${name}`);

    await this.isExistName(name);
    const boards: Board[] = await this.boardRepository.findBoardsWithName(name);

    if (!boards.length) {
      throw new NotFoundException(
        `${name}님이 작성한 게시물이 존재하지 않습니다.`,
      );
    }

    const readOnlyBoards = boards
      .filter((idx) => idx.isPublic)
      .map((idx) => idx.readOnlyDataMultiple);

    console.timeEnd(`find boards with ${name}`);

    return {
      statusCode: 200,
      message: `${name}님이 작성한 게시물을 가져왔습니다.`,
      result: readOnlyBoards,
    };
  }

  async findMyBoards(user: JwtPayload): Promise<Json> {
    console.time("find my boards");

    const name = user.name;
    const boards: Board[] = await this.boardRepository.findBoardsWithName(name);

    if (!boards.length) {
      throw new NotFoundException(
        `${name}님이 작성한 게시물이 존재하지 않습니다.`,
      );
    }

    const readOnlyBoards = boards.map((idx) => idx.readOnlyDataSingle);

    console.timeEnd("find my boards");

    return {
      statusCode: 200,
      message: `${name}님이 작성한 게시물을 가져왔습니다.`,
      result: readOnlyBoards,
    };
  }

  async updateBoard(
    id: string,
    payload: BoardRequestDto,
    user: JwtPayload,
  ): Promise<Json> {
    console.time(`update board by ${id}`);

    const { title, description, isPublic } = payload;
    await this.isExistId(id);
    const author = user.name;
    const now = Date().replace("GMT+0900 (대한민국 표준시)", "");
    await this.boardRepository.update(id, {
      title,
      author,
      description,
      isPublic,
      whenUpdated: now,
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
