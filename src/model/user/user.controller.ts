import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/login.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/register")
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }
}
