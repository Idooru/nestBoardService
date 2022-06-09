import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { BoardRequestDto } from "../dto/board-request.dto";
import { Board } from "../schemas/board.schema";
import { BoardRepository } from "../repository/board.repository";
import { JwtPayload } from "../../auth/jwt/jwt-payload.interface";
import { UserRepository } from "../../user/user.repository";
import { ImageRepository } from "../repository/image.repository";
import { ImageReturnDto } from "../dto/image-return.dto";
import { ReadOnlyBoardsDto } from "../dto/read-only-boards.dto";
import { ValidateExistForValue } from "../../../lib/validator/validate-exist.provider";

@Injectable()
export class BoardService {
  constructor(
    protected readonly boardRepository: BoardRepository,
    protected readonly imageRepository: ImageRepository,
    protected readonly userRepository: UserRepository,
    private readonly validateExist: ValidateExistForValue,
  ) {}

  async createBoard(
    body: BoardRequestDto,
    imgUrls: Array<ImageReturnDto>,
    user: JwtPayload,
  ): Promise<ReadOnlyBoardsDto> {
    const { title, description, isPublic } = body;
    const author = user.name;

    const Urls = imgUrls.map((idx) => idx.url);
    const undefinedOrUrls = !Urls.length ? undefined : Urls;

    const board: Board = await this.boardRepository.create({
      title,
      author,
      description,
      isPublic,
      imageList: undefinedOrUrls,
    });
    const readOnlyBoard: ReadOnlyBoardsDto = board.readOnlyData;

    return readOnlyBoard;
  }

  async findAllBoards(): Promise<ReadOnlyBoardsDto[]> {
    const boards: Array<Board> = await this.boardRepository.findBoards();

    if (!boards.length) {
      throw new NotFoundException("데이터베이스에 게시물이 없습니다.");
    }

    const readOnlyBoards: ReadOnlyBoardsDto[] = boards
      .filter((idx) => idx.isPublic)
      .map((idx) => idx.readOnlyData);

    return readOnlyBoards;
  }

  async findOneBoardWithId(id: string): Promise<ReadOnlyBoardsDto> {
    await this.validateExist.isExistBoardId(id);

    const board: Board = await this.boardRepository.findBoardWithId(id);
    const readOnlyBoard: ReadOnlyBoardsDto = board.readOnlyData;

    return readOnlyBoard;
  }

  async findAllBoardsWithAuthorName(
    name: string,
  ): Promise<ReadOnlyBoardsDto[]> {
    await this.validateExist.isExistAuthorName(name);

    const boards: Board[] = await this.boardRepository.findBoardsWithName(name);

    if (!boards.length) {
      throw new NotFoundException(
        `${name}님이 작성한 게시물이 존재하지 않습니다.`,
      );
    }

    const readOnlyBoards: ReadOnlyBoardsDto[] = boards
      .filter((idx) => idx.isPublic)
      .map((idx) => idx.readOnlyData);

    return readOnlyBoards;
  }

  async findMyBoards(user: JwtPayload): Promise<ReadOnlyBoardsDto[]> {
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

    return readOnlyBoards;
  }

  async updateBoard(
    id: string,
    body: BoardRequestDto,
    imgUrls: Array<ImageReturnDto>,
    user: JwtPayload,
  ): Promise<void> {
    await this.validateExist.isExistBoardId(id);

    const { title, description, isPublic } = body;
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
      imageList: undefinedOrUrls,
    });
  }

  async removeBoard(id: string, user: JwtPayload): Promise<void> {
    await this.validateExist.isExistBoardId(id);

    const author = user.name;

    const boards: Board[] = await this.boardRepository.findBoardsWithName(
      author,
    );

    const isMine = boards
      .map((idx) => idx.readOnlyData)
      .find((idx) => idx.author === author);

    if (!isMine) {
      throw new UnauthorizedException(
        "본인 게시물 이외에는 삭제 할 수 없습니다.",
      );
    }

    await this.boardRepository.delete(id);
  }
}
