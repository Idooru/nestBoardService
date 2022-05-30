import { User } from "src/model/user/schemas/user.schema";
import { PickType } from "@nestjs/mapped-types";

export class LoginDto extends PickType(User, ["email", "password"] as const) {}
