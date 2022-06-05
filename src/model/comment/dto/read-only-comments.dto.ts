import { PickType } from "@nestjs/mapped-types";
import { Comment } from "../schemas/comment.schema";

export class ReadOnlyCommentsDto extends PickType(Comment, [
  "id",
  "commenter",
  "content",
  "whatBoard",
] as const) {}
