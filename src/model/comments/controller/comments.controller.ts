import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CommentsService } from "../service/comment.service";
import { IsloginGuard } from "../../../lib/guards/islogin.guard";
import { GetDecodedJwt } from "src/lib/decorators/get-decoded-jwt.decorator";
import { JwtPayload } from "../../auth/jwt/jwt-payload.interface";
import { JSON } from "src/lib/interfaces/json.interface";
import { ReadOnlyCommentsDto } from "../dto/read-only-comments.dto";
import { Types } from "mongoose";

@Controller("Comments")
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  async findAllComments(): Promise<JSON<ReadOnlyCommentsDto[]>> {
    const result: ReadOnlyCommentsDto[] =
      await this.commentService.findAllComments();

    return {
      statusCode: 200,
      message: "전체 댓글을 가져옵니다.",
      result,
    };
  }

  @UseGuards(IsloginGuard)
  @Post("/:id/board")
  async createComment(
    @Param("id") id: Types.ObjectId,
    @Body() payload: { content: string },
    @GetDecodedJwt() user: JwtPayload,
  ): Promise<JSON<ReadOnlyCommentsDto>> {
    const result: ReadOnlyCommentsDto = await this.commentService.createComment(
      payload,
      id,
      user,
    );

    return {
      statusCode: 201,
      message: "댓글을 생성하였습니다.",
      result,
    };
  }
}
