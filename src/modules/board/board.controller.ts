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
} from "@nestjs/common";
import { BoardService } from "./board.service";
import { BoardRequestDto } from "./dto/board-request.dto";
import { Response } from "express";
import { JwtGuard } from "../auth/jwt/jwt.guard";
import { ServerResponse } from "http";

@Controller("board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createBoard(
    @Body() payload: BoardRequestDto,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    return res.status(201).json(await this.boardService.createBoard(payload));
  }

  @Get()
  async findAllBoard(@Res() res: Response): Promise<ServerResponse> {
    return res.status(200).json(await this.boardService.findAllBoard());
  }

  @Get(":id/id")
  async findOneBoard(
    @Param("id") id: string,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    return res.status(200).json(await this.boardService.findOneBoard(id));
  }

  @UseGuards(JwtGuard)
  @Patch(":id/id")
  async updateBoard(
    @Param("id") id: string,
    @Body() payload: BoardRequestDto,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    return res
      .status(201)
      .json(await this.boardService.updateBoard(id, payload));
  }

  @UseGuards(JwtGuard)
  @Delete(":id/id")
  async removeBoard(@Param("id") id: string, @Res() res: Response) {
    return res.status(200).json(await this.boardService.removeBoard(id));
  }
}
