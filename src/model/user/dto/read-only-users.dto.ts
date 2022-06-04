import { PickType } from "@nestjs/mapped-types";
import { User } from "../schemas/user.schema";

export class ReadOnlyUsersDto extends PickType(User, [
  "id",
  "email",
  "name",
] as const) {}
