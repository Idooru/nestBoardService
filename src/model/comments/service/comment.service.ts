import { Injectable, NotFoundException } from "@nestjs/common";
import { CommentRepository } from "../comments.repository";
import { ReadOnlyCommentsDto } from "../dto/read-only-comments.dto";
import { Comments } from "../schemas/comments.schema";
import { JwtPayload } from "../../auth/jwt/jwt-payload.interface";
import { CommentsCreateDto } from "../dto/comments-create.dto";
import { ValidateExistForValue } from "../../../lib/validator/validate-exist.provider";

import { Types } from "mongoose";

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly validateExist: ValidateExistForValue,
  ) {}

  async findAllComments(): Promise<ReadOnlyCommentsDto[]> {
    const comments: Array<Comments> =
      await this.commentRepository.findComments();

    if (!comments.length) {
      throw new NotFoundException("데이터베이스에 댓글이 없습니다.");
    }

    const readOnlyComments: ReadOnlyCommentsDto[] = comments.map(
      (idx) => idx.readOnlyData,
    );

    return readOnlyComments;
  }

  async createComment(
    payload: { content: string },
    id: Types.ObjectId,
    user: JwtPayload,
  ): Promise<ReadOnlyCommentsDto> {
    await this.validateExist.isExistBoardId(id);

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

    return readOnlyComment;
  }
}
