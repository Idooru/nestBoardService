import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { CommentsService } from "../service/comment.service";
import { ServerResponse } from "http";
import { Response } from "express";
import { IsloginGuard } from "../../../lib/guards/islogin.guard";
import { GetDecodedJwt } from "src/lib/decorators/user.decorator";
import { JwtPayload } from "../../auth/jwt/jwt-payload.interface";
import { Types } from "mongoose";

@Controller("Comments")
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  async findAllComments(@Res() res: Response): Promise<ServerResponse> {
    return res.status(200).json(await this.commentService.findAllComments());
  }

  @UseGuards(IsloginGuard)
  @Post("/:id/board")
  async createComment(
    @Param("id") target_id: Types.ObjectId,
    @Body() payload: { content: string },
    @GetDecodedJwt() user: JwtPayload,
    @Res() res: Response,
  ) {
    return res
      .status(201)
      .json(await this.commentService.createComment(payload, target_id, user));
  }
}
