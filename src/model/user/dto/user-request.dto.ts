import { PickType } from "@nestjs/mapped-types";
import { User } from "../schemas/user.schema";

export class UserRequestDto extends PickType(User, [
  "email",
  "name",
  "password",
] as const) {}
