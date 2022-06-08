import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { BoardRequestDto } from "./dto/board-request.dto";
import { Json } from "../../lib/interfaces/json.interface";
import { Board } from "./schemas/board.schema";
import { BoardRepository } from "./repository/board.repository";
import { JwtPayload } from "../auth/jwt/jwt-payload.interface";
import { UserRepository } from "../user/user.repository";
import { ImageRepository } from "./repository/image.repository";
import { ImageReturnDto } from "./dto/image-return.dto";
import { ReadOnlyBoardsDto } from "./dto/read-only-boards.dto";
import { Types } from "mongoose";
import * as mongoose from "mongoose";
import { Exist } from "src/lib/exists";

@Injectable()
export class BoardService {
  constructor(
    protected readonly boardRepository: BoardRepository,
    protected readonly imageRepository: ImageRepository,
    protected readonly userRepository: UserRepository,
  ) {}

  private readonly validate = new Exist(
    this.boardRepository,
    this.userRepository,
  );

  async createBoard(
    payload: BoardRequestDto,
    imgUrls: Array<ImageReturnDto>,
    user: JwtPayload,
  ): Promise<Json<ReadOnlyBoardsDto>> {
    const { title, description, isPublic } = payload;
    const author = user.name;

    const Urls = imgUrls.map((idx) => idx.url);
    const undefinedOrUrls = !Urls.length ? undefined : Urls;

    const board: Board = await this.boardRepository.create({
      title,
      author,
      description,
      isPublic,
      imgUrls: undefinedOrUrls,
    });
    const readOnlyBoard: ReadOnlyBoardsDto = board.readOnlyData;

    return {
      statusCode: 201,
      message: "게시물이 생성되었습니다.",
      result: readOnlyBoard,
    };
  }

  async uploadImg(
    files: Array<Express.Multer.File>,
    user: JwtPayload,
  ): Promise<Json<ImageReturnDto[]>> {
    const imgUrls: ImageReturnDto[] = [];
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

    return {
      statusCode: 201,
      message: "사진을 업로드 하였습니다.",
      result: imgUrls,
    };
  }

  async findAllBoards(): Promise<Json<ReadOnlyBoardsDto[]>> {
    const boards: Array<Board> = await this.boardRepository.findBoards();

    if (!boards.length) {
      throw new NotFoundException("데이터베이스에 게시물이 없습니다.");
    }

    const readOnlyBoards: ReadOnlyBoardsDto[] = boards
      .filter((idx) => idx.isPublic)
      .map((idx) => idx.readOnlyData);

    return {
      statusCode: 200,
      message: "전체 게시물을 가져왔습니다.",
      result: readOnlyBoards,
    };
  }

  async findOneBoardWithId(id: string): Promise<Json<ReadOnlyBoardsDto>> {
    const found: boolean = await this.validate.isExistId(id);

    if (!found) {
      throw new NotFoundException(`유효하지 않은 id입니다. id: ${id}`);
    }

    const board: Board = await this.boardRepository.findBoardWithId(id);
    const readOnlyBoard: ReadOnlyBoardsDto = board.readOnlyData;

    return {
      statusCode: 200,
      message: `${id}에 해당하는 게시물을 가져왔습니다.`,
      result: readOnlyBoard,
    };
  }

  async findAllBoardsWithAuthorName(
    name: string,
  ): Promise<Json<ReadOnlyBoardsDto[]>> {
    const found: boolean = await this.validate.isExistName(name);

    if (!found) {
      throw new NotFoundException(`유효하지 않은 name입니다. name: {${name}}`);
    }

    const boards: Board[] = await this.boardRepository.findBoardsWithName(name);

    if (!boards.length) {
      throw new NotFoundException(
        `${name}님이 작성한 게시물이 존재하지 않습니다.`,
      );
    }

    const readOnlyBoards: ReadOnlyBoardsDto[] = boards
      .filter((idx) => idx.isPublic)
      .map((idx) => idx.readOnlyData);

    return {
      statusCode: 200,
      message: `${name}님이 작성한 게시물을 가져왔습니다.`,
      result: readOnlyBoards,
    };
  }

  async findMyBoards(user: JwtPayload): Promise<Json<ReadOnlyBoardsDto[]>> {
    const name = user.name;
    const boards: Board[] = await this.boardRepository.findBoardsWithName(name);

    if (!boards.length) {
      throw new NotFoundException(
        `${name}님이 작성한 게시물이 존재하지 않습니다.`,
      );
    }

    const readOnlyBoards: ReadOnlyBoardsDto[] = boards.map(
      (idx) => idx.readOnlyData,
    );

    return {
      statusCode: 200,
      message: `${name}님이 작성한 게시물을 가져왔습니다.`,
      result: readOnlyBoards,
    };
  }

  async updateBoard(
    id: string,
    payload: BoardRequestDto,
    imgUrls: Array<ImageReturnDto>,
    user: JwtPayload,
  ): Promise<Json<void>> {
    const found: boolean = await this.validate.isExistId(id);

    if (!found) {
      throw new NotFoundException(`유효하지 않은 id입니다. id: {${id}}`);
    }

    const { title, description, isPublic } = payload;
    const author = user.name;

    const boards: Board[] = await this.boardRepository.findBoardsWithName(
      author,
    );

    const isMine = boards
      .map((idx) => idx.readOnlyData)
      .find((idx) => idx.author === author);

    if (!isMine) {
      throw new UnauthorizedException(
        "본인 게시물 이외에는 수정 할 수 없습니다.",
      );
    }

    const Urls = imgUrls.map((idx) => idx.url);
    const undefinedOrUrls = !Urls.length ? undefined : Urls;

    await this.boardRepository.update(id, {
      title,
      author,
      description,
      isPublic,
      imgUrls: undefinedOrUrls,
    });

    return {
      statusCode: 201,
      message: `${id}에 해당하는 게시물을 수정하였습니다.`,
    };
  }

  async removeBoard(id: Types.ObjectId, user: JwtPayload): Promise<Json<void>> {
    try {
      this.validate.isExistId(id);
    } catch (err) {
      throw new NotFoundException(`유효하지 않은 id입니다. id: {${id}}`);
    }

    const author = user.name;

    const boards: Board[] = await this.boardRepository.findBoardsWithName(
      author,
    );

    const found = boards
      .map((idx) => idx.readOnlyData)
      .find((idx) => idx.author === author);

    if (!found) {
      throw new UnauthorizedException(
        "본인 게시물 이외에는 삭제 할 수 없습니다.",
      );
    }

    await this.boardRepository.delete(id);

    return {
      statusCode: 200,
      message: `${id}에 해당하는 게시물을 삭제하였습니다.`,
    };
  }
}
