import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { ServerResponse } from "http";
import { Response } from "express";
import { IsloginGuard } from "../auth/jwt/islogin.guard";
import { GetDecodedJwt } from "src/lib/decorators/user.decorator";
import { JwtPayload } from "../auth/jwt/jwt-payload.interface";

@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async findAllComments(@Res() res: Response): Promise<ServerResponse> {
    return res.status(200).json(await this.commentService.findAllComments());
  }

  @UseGuards(IsloginGuard)
  @Post("/:id/board")
  async createComment(
    @Param("id") id: string,
    @Body() payload: { content: string },
    @GetDecodedJwt() user: JwtPayload,
    @Res() res: Response,
  ) {
    return res
      .status(201)
      .json(await this.commentService.createComment(payload, id, user));
  }
}
