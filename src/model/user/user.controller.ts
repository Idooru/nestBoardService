import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/register.dto";
// import { LoginDto } from "./dto/login.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/register")
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  // @Post("/login")
  // login(@Body() loginDto: LoginDto) {
  //   return "login";
  // }
}
