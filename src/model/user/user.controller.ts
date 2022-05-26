import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "../auth/dto/login.dto";

@Controller("/user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("/register")
  async register(@Body() payload: RegisterDto) {
    return await this.userService.register(payload);
  }

  @HttpCode(200)
  @Post("/login")
  async login(@Body() payload: LoginDto) {
    return await this.authService.login(payload);
  }
}
