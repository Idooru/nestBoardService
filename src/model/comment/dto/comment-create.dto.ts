import { PickType } from "@nestjs/mapped-types";
import { Comment } from "../schemas/comment.schema";

export class CommentCreateDto extends PickType(Comment, [
  "commenter",
  "content",
  "info",
] as const) {}
