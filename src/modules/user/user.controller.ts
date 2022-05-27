import { Body, Controller, Post, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "../auth/dto/login.dto";
import { Json } from "src/common/interfaces/json.interface";
import { Response } from "express";

@Controller("/user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("/register")
  async register(
    @Body() payload: RegisterDto,
    @Res() res: Response,
  ): Promise<void> {
    res.status(200).json(await this.userService.register(payload));
  }

  @Post("/login")
  async login(@Body() payload: LoginDto, @Res() res: Response): Promise<void> {
    const loginService: Json = await this.authService.login(payload);
    const jwtToken = loginService.result;
    res
      .status(200)
      .setHeader("Authorization", "Bearer " + jwtToken)
      .json(loginService);
  }
}
