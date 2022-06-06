import { Injectable, NotFoundException } from "@nestjs/common";
import { Json } from "src/lib/interfaces/json.interface";
import { CommentRepository } from "../comment.repository";
import { ReadOnlyCommentsDto } from "../dto/read-only-comments.dto";
import { Comment } from "../schemas/comment.schema";
import { JwtPayload } from "../../auth/jwt/jwt-payload.interface";
import { BoardRepository } from "../../board/repository/board.repository";
import { CreateCommentDto } from "../dto/create-comment.dto";

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly boardRepository: BoardRepository,
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
    id: string,
    user: JwtPayload,
  ): Promise<Json<ReadOnlyCommentsDto>> {
    const { content } = payload;

    const found: boolean = await this.boardRepository.existBoardId(id);

    if (!found) {
      throw new NotFoundException(`유효하지 않은 게시물 id입니다. id: {${id}}`);
    }

    const commentPayload: CreateCommentDto = {
      commenter: user.name,
      content,
      whatBoard: id,
    };

    const comment: Comment = await this.commentRepository.create(
      commentPayload,
    );

    await this.boardRepository.updateComment(id, comment);

    const readOnlyComment: ReadOnlyCommentsDto = comment.readOnlyData;

    return {
      statusCode: 201,
      message: "댓글을 생성하였습니다.",
      result: readOnlyComment,
    };
  }
}
