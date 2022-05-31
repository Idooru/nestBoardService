import { PickType } from "@nestjs/mapped-types";
import { Board } from "../schemas/board.schema";

export class BoardCreateDto extends PickType(Board, [
  "title",
  "author",
  "description",
  "isPublic",
  "whenCreated",
] as const) {}
