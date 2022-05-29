import { Controller, Post, Body, Res } from "@nestjs/common";
import { Response } from "express";
import { ServerResponse } from "http";
import { Json } from "src/common/interfaces/json.interface";
import { AuthService } from "../auth/auth.service";
import { LoginDto } from "../auth/dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UserService } from "./user.service";

@Controller("/user")
export class UserController {
  constructor(
    readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("/register")
  async register(
    @Body() payload: RegisterDto,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    return res.status(201).json(await this.userService.register(payload));
  }

  @Post("/login")
  async login(
    @Body() payload: LoginDto,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    const json: Json = await this.authService.login(payload);
    const jwtToken = json.result;

    return res
      .setHeader("Authorization", "" + jwtToken)
      .status(200)
      .json(json);
  }
}
