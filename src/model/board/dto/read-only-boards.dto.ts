import { PickType } from "@nestjs/mapped-types";
import { Board } from "../schemas/board.schema";

export class ReadOnlyBoardsDto extends PickType(Board, [
  "id",
  "title",
  "author",
  "description",
  "isPublic",
] as const) {}
