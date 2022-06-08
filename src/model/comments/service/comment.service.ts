import { Injectable, NotFoundException } from "@nestjs/common";
import { Json } from "src/lib/interfaces/json.interface";
import { CommentRepository } from "../comments.repository";
import { ReadOnlyCommentsDto } from "../dto/read-only-comments.dto";
import { Comments } from "../schemas/comments.schema";
import { JwtPayload } from "../../auth/jwt/jwt-payload.interface";
import { BoardRepository } from "../../board/repository/board.repository";
import { CommentsCreateDto } from "../dto/comments-create.dto";

import { Types } from "mongoose";

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  async findAllComments(): Promise<Json<ReadOnlyCommentsDto[]>> {
    const comments: Array<Comments> =
      await this.commentRepository.findComments();

    if (!comments.length) {
      throw new NotFoundException("데이터베이스에 댓글이 없습니다.");
    }

    const readOnlyComments: ReadOnlyCommentsDto[] = comments.map(
      (idx) => idx.readOnlyData,
    );

    return {
      statusCode: 200,
      message: "전체 댓글을 가져옵니다.",
      result: readOnlyComments,
    };
  }

  async createComment(
    payload: { content: string },
    id: Types.ObjectId,
    user: JwtPayload,
  ): Promise<Json<ReadOnlyCommentsDto>> {
    const found = await this.boardRepository.existBoardId(id);

    if (!found) {
      throw new NotFoundException(`유효하지 않은 id입니다. id: {${id}}`);
    }

    const { content } = payload;

    const commentPayload: CommentsCreateDto = {
      commenter: user.name,
      content,
      whichBoard: id,
    };

    const Comments: Comments = await this.commentRepository.create(
      commentPayload,
    );

    const readOnlyComment: ReadOnlyCommentsDto = Comments.readOnlyData;

    return {
      statusCode: 201,
      message: "댓글을 생성하였습니다.",
      result: readOnlyComment,
    };
  }
}
