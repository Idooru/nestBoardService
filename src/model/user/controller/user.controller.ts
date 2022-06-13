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
import { JSON } from "src/lib/interfaces/json.interface";
import { AuthService } from "../../auth/auth.service";
import { LoginDto } from "../../auth/dto/login.dto";
import { UserRequestDto } from "../dto/user-request.dto";
import { UserService } from "../service/user.service";
import { IsloginGuard } from "../../../lib/guards/islogin.guard";
import { GetDecodedJwt } from "src/lib/decorators/get-decoded-jwt.decorator";
import { JwtPayload } from "../../auth/jwt/jwt-payload.interface";
import { ReadOnlyUsersDto } from "../dto/read-only-users.dto";
import { UserInfo } from "src/lib/interfaces/user.info.interface";
import { cookieOption } from "src/lib/etc";

@Controller("/user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("/register")
  async register(
    @Body() body: UserRequestDto,
  ): Promise<JSON<ReadOnlyUsersDto>> {
    const result = await this.userService.register(body);

    return {
      statusCode: 201,
      message: "회원가입을 완료하였습니다.",
      result,
    };
  }

  @Post("/login")
  async login(
    @Body() body: LoginDto,
    @Res() res: Response,
  ): Promise<JSON<string>> {
    const jwtToken: string = await this.authService.login(body);

    res.cookie("JWT_COOKIE", jwtToken, cookieOption);

    return {
      statusCode: 201,
      message: `${body.email}계정으로 로그인에 성공하였습니다.`,
    };
  }

  @UseGuards(IsloginGuard)
  @Get("/refresh-token")
  async refreshToken(
    @GetDecodedJwt() user: JwtPayload,
    @Res() res: Response,
  ): Promise<JSON<string>> {
    const jwtToken: string = await this.authService.refreshTokenWhenLogin(user);

    res.cookie("JWT_COOKIE", jwtToken, cookieOption);

    return {
      statusCode: 200,
      message: "토큰을 재발급합니다.",
      result: jwtToken,
    };
  }

  @UseGuards(IsloginGuard)
  @Get("/whoami")
  whoAmI(@GetDecodedJwt() user: JwtPayload): JSON<UserInfo> {
    return {
      statusCode: 200,
      message: "본인 정보를 가져옵니다.",
      result: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  @UseGuards(IsloginGuard)
  @Delete("/logout")
  logout(@Res() res: Response, @GetDecodedJwt() user: JwtPayload): JSON<void> {
    res.clearCookie("JWT_COOKIE");
    return {
      statusCode: 200,
      message: `${user.email}계정으로 로그아웃을 완료했습니다.`,
    };
  }

  @UseGuards(IsloginGuard)
  @Patch("/set-user")
  async setUser(
    @Body() body: UserRequestDto,
    @GetDecodedJwt() user: JwtPayload,
    @Res() res: Response,
  ): Promise<JSON<string>> {
    const jwtToken: string = await this.userService.setUser(body, user);

    res.cookie("JWT_COOKIE", jwtToken, cookieOption);

    return {
      statusCode: 200,
      message: "사용자 정보를 수정하고 토큰을 재발급합니다.",
      result: jwtToken,
    };
  }

  @UseGuards(IsloginGuard)
  @Delete("/secession")
  async secession(
    @GetDecodedJwt() user: JwtPayload,
    @Res() res: Response,
  ): Promise<JSON<void>> {
    await this.userService.secession(user);

    res.clearCookie("JWT_COOKIE");

    return {
      statusCode: 200,
      message: "회원 탈퇴를 완료하였습니다.",
    };
  }
}
