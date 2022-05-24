import { PickType } from "@nestjs/mapped-types";
import { Board } from "../schemas/board.schema";

export class CreateBoardDto extends PickType(Board, [
  "title",
  "description",
  "isPublic",
] as const) {}
