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
import { BoardService } from "./board.service";
import { BoardRequestDto } from "./dto/board-request.dto";
import { Response } from "express";
import { ServerResponse } from "http";
import { IsloginGuard } from "../../lib/guards/islogin.guard";
import { GetDecodedJwt } from "src/lib/decorators/user.decorator";
import { JwtPayload } from "../auth/jwt/jwt-payload.interface";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MulterOperation } from "src/lib/multer/multer-operation";
import { Json } from "src/lib/interfaces/json.interface";
import { GetImageCookies } from "src/lib/decorators/get-image-cookies.decorator";
import { ImageReturnDto } from "./dto/image-return.dto";
import { ReadOnlyBoardsDto } from "./dto/read-only-boards.dto";
import { Types } from "mongoose";

@Controller("board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(IsloginGuard)
  @Post()
  async createBoard(
    @Body() payload: BoardRequestDto,
    @GetDecodedJwt() user: JwtPayload,
    @GetImageCookies() imgUrls: Array<ImageReturnDto>,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    const json: Json<ReadOnlyBoardsDto> = await this.boardService.createBoard(
      payload,
      imgUrls,
      user,
    );

    imgUrls.forEach((idx) => res.clearCookie(idx.name));

    return res.status(201).json(json);
  }

  @UseGuards(IsloginGuard)
  @UseInterceptors(
    FilesInterceptor("image", 10, new MulterOperation("image").apply()),
  )
  @Post("/image")
  async uploadImgForBoard(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetDecodedJwt() user: JwtPayload,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    console.log(files);

    const json: Json<ImageReturnDto[]> = await this.boardService.uploadImg(
      files,
      user,
    );
    const imgInfo = json.result;

    imgInfo.forEach((idx: ImageReturnDto) =>
      res.cookie(idx.name, idx.url, { httpOnly: true }),
    );

    return res.status(201).json(json);
  }

  @Get()
  async findAllBoards(@Res() res: Response): Promise<ServerResponse> {
    return res.status(200).json(await this.boardService.findAllBoards());
  }

  @Get(":id/id")
  async findOneBoardWithId(
    @Param("id") id: string,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    return res.status(200).json(await this.boardService.findOneBoardWithId(id));
  }

  @Get(":name/author")
  async findBoardsWithName(
    @Param("name") name: string,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    return res
      .status(200)
      .json(await this.boardService.findAllBoardsWithAuthorName(name));
  }

  @UseGuards(IsloginGuard)
  @Get("/my-post")
  async findMyBoards(
    @GetDecodedJwt() user: JwtPayload,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    return res.status(200).json(await this.boardService.findMyBoards(user));
  }

  @UseGuards(IsloginGuard)
  @Patch(":id/id")
  async updateBoard(
    @Param("id") id: string,
    @Body() payload: BoardRequestDto,
    @Res() res: Response,
    @GetDecodedJwt() user: JwtPayload,
    @GetImageCookies() imgUrls: Array<ImageReturnDto>,
  ): Promise<ServerResponse> {
    const json: Json<void> = await this.boardService.updateBoard(
      id,
      payload,
      imgUrls,
      user,
    );

    imgUrls.forEach((idx) => res.clearCookie(idx.name));

    return res.status(201).json(json);
  }

  @UseGuards(IsloginGuard)
  @Delete(":id/id")
  async removeBoard(
    @Param("id") id: Types.ObjectId,
    @GetDecodedJwt() user: JwtPayload,
    @Res() res: Response,
  ) {
    return res.status(200).json(await this.boardService.removeBoard(id, user));
  }
}
