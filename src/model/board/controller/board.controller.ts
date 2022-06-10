import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { BoardService } from "../service/board.service";
import { BoardRequestDto } from "../dto/board-request.dto";
import { Response } from "express";
import { IsloginGuard } from "../../../lib/guards/islogin.guard";
import { GetDecodedJwt } from "src/lib/decorators/user.decorator";
import { JwtPayload } from "../../auth/jwt/jwt-payload.interface";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MulterOperation } from "src/lib/multer/multer-operation";
import { JSON } from "src/lib/interfaces/json.interface";
import { GetImageCookies } from "src/lib/decorators/get-image-cookies.decorator";
import { ImageReturnDto } from "../dto/image-return.dto";
import { ReadOnlyBoardsDto } from "../dto/read-only-boards.dto";
import { ImageService } from "../service/image.service";
import { cookieOption, maxNumberOfImage } from "src/lib/etc";

@Controller("board")
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly imageService: ImageService,
  ) {}

  @UseGuards(IsloginGuard)
  @Post()
  async createBoard(
    @Body() body: BoardRequestDto,
    @GetDecodedJwt() user: JwtPayload,
    @GetImageCookies() imgUrls: Array<ImageReturnDto>,
    @Res() res: Response,
  ): Promise<JSON<ReadOnlyBoardsDto>> {
    const result: ReadOnlyBoardsDto = await this.boardService.createBoard(
      body,
      imgUrls,
      user,
    );

    imgUrls.forEach((idx) => res.clearCookie(idx.name));

    return {
      statusCode: 201,
      message: "게시물이 생성되었습니다.",
      result,
    };
  }

  @UseGuards(IsloginGuard)
  @UseInterceptors(
    FilesInterceptor(
      "image",
      maxNumberOfImage,
      new MulterOperation("image").apply(),
    ),
  )
  @Post("/image")
  async uploadImgForBoard(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetDecodedJwt() user: JwtPayload,
    @Res() res: Response,
  ): Promise<JSON<ImageReturnDto[]>> {
    console.log("logging image info ->\n", files);

    const result: ImageReturnDto[] = await this.imageService.uploadImg(
      files,
      user,
    );

    result.forEach((idx: ImageReturnDto) =>
      res.cookie(idx.name, idx.url, cookieOption),
    );

    return {
      statusCode: 201,
      message: "사진을 업로드 하였습니다.",
      result,
    };
  }

  @Get()
  async findAllBoards(): Promise<JSON<ReadOnlyBoardsDto[]>> {
    const result: ReadOnlyBoardsDto[] = await this.boardService.findAllBoards();

    return {
      statusCode: 200,
      message: "전체 게시물을 가져왔습니다.",
      result,
    };
  }

  @Get(":id/id")
  async findOneBoardWithId(
    @Param("id") id: string,
  ): Promise<JSON<ReadOnlyBoardsDto>> {
    const result: ReadOnlyBoardsDto =
      await this.boardService.findOneBoardWithId(id);

    return {
      statusCode: 200,
      message: `${id}에 해당하는 게시물을 가져왔습니다.`,
      result,
    };
  }

  @Get(":name/author")
  async findBoardsWithName(
    @Param("name") name: string,
  ): Promise<JSON<ReadOnlyBoardsDto[]>> {
    const result: ReadOnlyBoardsDto[] =
      await this.boardService.findAllBoardsWithAuthorName(name);

    return {
      statusCode: 200,
      message: `${name}님이 작성한 게시물을 가져왔습니다.`,
      result,
    };
  }

  @UseGuards(IsloginGuard)
  @Get("/my-post")
  async findMyBoards(
    @GetDecodedJwt() user: JwtPayload,
  ): Promise<JSON<ReadOnlyBoardsDto[]>> {
    const { name } = user;

    const result: ReadOnlyBoardsDto[] = await this.boardService.findMyBoards(
      user,
    );

    return {
      statusCode: 200,
      message: `${name}님이 작성한 게시물을 가져왔습니다.`,
      result,
    };
  }

  @UseGuards(IsloginGuard)
  @Patch(":id/id")
  async updateBoard(
    @Param("id") id: string,
    @Res() res: Response,
    @Body() body: BoardRequestDto,
    @GetDecodedJwt() user: JwtPayload,
    @GetImageCookies() imgUrls: Array<ImageReturnDto>,
  ): Promise<JSON<void>> {
    await this.boardService.updateBoard(id, body, imgUrls, user);

    imgUrls.forEach((idx) => res.clearCookie(idx.name));

    return {
      statusCode: 201,
      message: `${id}에 해당하는 게시물을 수정하였습니다.`,
    };
  }

  @UseGuards(IsloginGuard)
  @Delete(":id/id")
  async removeBoard(
    @Param("id") id: string,
    @GetDecodedJwt() user: JwtPayload,
  ) {
    await this.boardService.removeBoard(id, user);

    return {
      statusCode: 200,
      message: `${id}에 해당하는 게시물을 삭제하였습니다.`,
    };
  }

  @UseGuards(IsloginGuard)
  @Delete("/image")
  cancleUploadImage(
    @GetImageCookies() imgUrls: Array<ImageReturnDto>,
    @Res() res: Response,
  ): JSON<void> {
    imgUrls.forEach((idx) => res.clearCookie(idx.name));

    return {
      statusCode: 200,
      message: "사진 업로드를 취소하였습니다.",
    };
  }
}
