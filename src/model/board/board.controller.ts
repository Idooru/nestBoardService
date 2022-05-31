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
import { IsloginGuard } from "../auth/jwt/islogin.guard";
import { GetDecoded } from "src/lib/decorators/user.decorator";
import { JwtPayload } from "../auth/jwt/jwt-payload.interface";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Test } from "../../lib/multer/multer-option";

@Controller("board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(IsloginGuard)
  @Post()
  async createBoard(
    @Body() payload: BoardRequestDto,
    @Res() res: Response,
    @GetDecoded() user: JwtPayload,
  ): Promise<ServerResponse> {
    return res
      .status(201)
      .json(await this.boardService.createBoard(payload, user));
  }

  @UseGuards(new IsloginGuard())
  @UseInterceptors(FilesInterceptor("image", 10, new Test("H").print()))
  @Post("/img")
  async uploadImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
    @GetDecoded() user: JwtPayload,
  ): Promise<any> {
    return 1;
    // return res.status(201).json(await this.boardService.uploadImg(files, user));
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

  @Get(":name/name")
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
    @GetDecoded() user: JwtPayload,
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
    @GetDecoded() user: JwtPayload,
  ): Promise<ServerResponse> {
    return res
      .status(201)
      .json(await this.boardService.updateBoard(id, payload, user));
  }

  @UseGuards(IsloginGuard)
  @Delete(":id/id")
  async removeBoard(@Param("id") id: string, @Res() res: Response) {
    return res.status(200).json(await this.boardService.removeBoard(id));
  }
}
