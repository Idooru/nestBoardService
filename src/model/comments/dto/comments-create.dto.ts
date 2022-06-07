import { PickType } from "@nestjs/mapped-types";
import { Comments } from "../schemas/comments.schema";

export class CommentsCreateDto extends PickType(Comments, [
  "commenter",
  "content",
  "info",
] as const) {}
