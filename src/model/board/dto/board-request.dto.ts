import { PickType } from "@nestjs/mapped-types";
import { Board } from "../schemas/board.schema";

export class BoardRequestDto extends PickType(Board, [
  "title",
  "description",
  "isPublic",
] as const) {}
