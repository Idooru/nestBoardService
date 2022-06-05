import { PickType } from "@nestjs/mapped-types";
import { Comment } from "../schemas/comment.schema";

export class CreateCommentDto extends PickType(Comment, [
  "commenter",
  "content",
  "whatBoard",
] as const) {}
