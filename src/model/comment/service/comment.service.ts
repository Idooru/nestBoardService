import { Injectable, NotFoundException } from "@nestjs/common";
import { Json } from "src/lib/interfaces/json.interface";
import { CommentRepository } from "../comment.repository";
import { ReadOnlyCommentsDto } from "../dto/read-only-comments.dto";
import { Comment } from "../schemas/comment.schema";
import { JwtPayload } from "../../auth/jwt/jwt-payload.interface";
import { BoardRepository } from "../../board/repository/board.repository";
import { CommentCreateDto } from "../dto/comment-create.dto";
import { UserRepository } from "../../user/user.repository";
import { Types } from "mongoose";

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly boardRepository: BoardRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findAllComments(): Promise<Json<ReadOnlyCommentsDto[]>> {
    const comments: Array<Comment> =
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
    target_id: Types.ObjectId,
    user: JwtPayload,
  ): Promise<Json<ReadOnlyCommentsDto>> {
    const { content } = payload;
    const email = user.email;

    const found: boolean = await this.boardRepository.existBoardId(target_id);

    if (!found) {
      throw new NotFoundException(
        `유효하지 않은 게시물 id입니다. id: {${target_id}}`,
      );
    }

    const validateCommenter = await this.userRepository.findUserByEmail(email);

    const commentPayload: CommentCreateDto = {
      commenter: validateCommenter._id,
      content,
      info: target_id,
    };

    const comment: Comment = await this.commentRepository.create(
      commentPayload,
    );

    const readOnlyComment: ReadOnlyCommentsDto = comment.readOnlyData;

    return {
      statusCode: 201,
      message: "댓글을 생성하였습니다.",
      result: readOnlyComment,
    };
  }
}
