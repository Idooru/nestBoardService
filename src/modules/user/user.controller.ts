import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ServerResponse } from "http";
import { Json } from "src/lib/interfaces/json.interface";
import { AuthService } from "../auth/auth.service";
import { LoginDto } from "../auth/dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UserService } from "./user.service";
import { IsloginGuard } from "../auth/jwt/islogin.guard";
import { GetDecoded } from "src/lib/decorators/user.decorator";
import { JwtPayload } from "../auth/jwt/jwt-payload.interface";

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
      .status(200)
      .cookie("JWT_COOKIE", jwtToken, { httpOnly: true })
      .json(json);
  }

  @UseGuards(IsloginGuard)
  @Get("/whoami")
  async whoAmI(
    @GetDecoded() user: JwtPayload,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    return res.status(200).json(await this.authService.whoAmI(user));
  }

  @UseGuards(IsloginGuard)
  @Get("/refreshToken")
  async refreshToken(
    @GetDecoded() user: JwtPayload,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    const json: Json = await this.authService.refreshToken(user);
    const jwtToken = json.result;

    return res
      .status(200)
      .cookie("JWT_COOKIE", jwtToken, {
        httpOnly: true,
      })
      .json(json);
  }

  @UseGuards(IsloginGuard)
  @Get("/logout")
  logout(@Req() req: Request, @Res() res: Response) {
    const json: Json = {
      statusCode: 200,
      message: "로그아웃을 완료했습니다.",
    };
    return res.cookie("JWT_COOKIE", "").json(json);
  }
}
