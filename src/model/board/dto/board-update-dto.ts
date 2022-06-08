import { PickType } from "@nestjs/mapped-types";
import { Board } from "../schemas/board.schema";

export class BoardUpdateDto extends PickType(Board, [
  "title",
  "author",
  "description",
  "isPublic",
  "imageList",
] as const) {}
