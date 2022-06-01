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
    let { imgName } = payload;

    if (imgName.length >= 2) {
      imgName = "asd";
    } else {
    }

    const found: boolean = await this.imageRepository.existImgName(imgName);

    if (!found) {
      throw new NotFoundException(
        `유효하지 않은 imgName입니다. imgName: {${imgName}}`,
      );
    }

    const imgUrl = await this.imageRepository.findImgUrlByName();

    const author = user.name;
    const now = Date().replace("GMT+0900 (대한민국 표준시)", "");

    const board: Board = await this.boardRepository.create({
      title,
      author,
      description,
      isPublic,
      imgUrl,
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
    console.time("uplaod image");

    let fileName: Array<string> | string;

    if (!files.length) {
      throw new BadRequestException(
        "사진을 업로드 할 수 없습니다. 사진을 제시해주세요.",
      );
    }

    const author = user.name;

    if (files.length >= 2) {
      fileName = files.map((idx) => idx.filename);
      files.forEach(async (idx) => {
        const fileName = idx.filename;
        await this.imageRepository.uploadImg({ fileName, author });
      });
    } else {
      fileName = files[0].filename;
      await this.imageRepository.uploadImg({ fileName, author });
    }

    console.timeEnd("upload image");

    return {
      statusCode: 201,
      message: "사진을 업로드 하였습니다.",
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
