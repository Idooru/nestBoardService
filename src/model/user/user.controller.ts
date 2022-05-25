import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "../auth/dto/login.dto";
import { AuthService } from "../auth/auth.service";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("/register")
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post("/login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
