import { PickType } from "@nestjs/mapped-types";
import { Board } from "../schemas/board.schema";

export class BoardCreateUpdateDto extends PickType(Board, [
  "title",
  "author",
  "description",
  "isPublic",
] as const) {}
