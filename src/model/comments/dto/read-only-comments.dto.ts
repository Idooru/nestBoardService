import { PickType } from "@nestjs/mapped-types";
import { Comments } from "../schemas/comments.schema";

export class ReadOnlyCommentsDto extends PickType(Comments, [
  "id",
  "commenter",
  "content",
] as const) {}
