import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { Json } from "src/lib/interfaces/json.interface";
import { User } from "../user/schemas/user.schema";
import { JwtPayload } from "./jwt/jwt-payload.interface";

import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: LoginDto): Promise<Json> {
    console.time("login");

    const { email, password } = payload;
    const user: User = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException("아이디 혹은 비밀번호가 틀렸습니다.");
    }

    const compared: boolean = await bcrypt.compare(password, user.password);

    if (!compared) {
      throw new BadRequestException("아이디 혹은 비밀번호가 틀렸습니다.");
    }

    const dataToBeJwt: JwtPayload = {
      email,
      who: { id: user.id, name: user.name },
    };

    const jwtToken: string = this.jwtService.sign(dataToBeJwt);

    console.timeEnd("login");

    return {
      statusCode: 200,
      message: "로그인에 성공하였습니다.",
      result: jwtToken,
    };
  }

  async whoAmI(decryptedToken: JwtPayload): Promise<Json> {
    console.time("whoAmI");

    const id: string = decryptedToken.who.id;
    const me: User = await this.userRepository.findUserById(id);

    console.timeEnd("whoAmI");

    return {
      statusCode: 200,
      message: "본인 정보를 가져옵니다.",
      result: me.readOnlyDataSingle,
    };
  }

  async refreshToken(decryptedToken: JwtPayload): Promise<Json> {
    console.time("refreshToken");

    const id: string = decryptedToken.who.id;
    const user: User = await this.userRepository.findUserById(id);

    const email = user.email;
    const name = user.name;

    const dataToBeToken: JwtPayload = { email, who: { id, name } };
    const jwtToken: string = this.jwtService.sign(dataToBeToken);

    console.timeEnd("refreshToken");

    return {
      statusCode: 200,
      message: "토큰을 재발급합니다.",
      result: jwtToken,
    };
  }
}
