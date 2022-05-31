import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Patch,
  Delete,
} from "@nestjs/common";
import { Response } from "express";
import { ServerResponse } from "http";
import { Json } from "src/lib/interfaces/json.interface";
import { AuthService } from "../auth/auth.service";
import { LoginDto } from "../auth/dto/login.dto";
import { UserRequestDto } from "./dto/user-request.dto";
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
    @Body() payload: UserRequestDto,
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
  @Get("/refresh-token")
  async refreshToken(
    @GetDecoded() user: JwtPayload,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    const json: Json = await this.authService.refreshToken(user);
    const jwtToken = json.result;

    return res
      .status(200)
      .cookie("JWT_COOKIE", jwtToken, { httpOnly: true })
      .json(json);
  }

  @UseGuards(IsloginGuard)
  @Get("/whoami")
  whoAmI(@GetDecoded() user: JwtPayload, @Res() res: Response): ServerResponse {
    const json: Json = {
      statusCode: 200,
      message: "본인 정보를 가져옵니다.",
      result: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
    return res.status(200).json(json);
  }

  @UseGuards(IsloginGuard)
  @Delete("/logout")
  logout(@Res() res: Response): ServerResponse {
    const json: Json = {
      statusCode: 200,
      message: "로그아웃을 완료했습니다.",
    };
    return res.status(200).clearCookie("JWT_COOKIE").json(json);
  }

  @UseGuards(IsloginGuard)
  @Patch("/set-user")
  async setUser(
    @Body() payload: UserRequestDto,
    @GetDecoded() user: JwtPayload,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    return res.status(200).json(await this.userService.setUser(payload, user));
  }

  @UseGuards(IsloginGuard)
  @Delete("/secession")
  async secession(
    @GetDecoded() user: JwtPayload,
    @Res() res: Response,
  ): Promise<ServerResponse> {
    return res.status(200).json(await this.userService.secession(user));
  }
}
