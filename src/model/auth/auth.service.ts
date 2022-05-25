import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { UserRepository } from "../user/user.repository";
import { User } from "../user/schemas/user.schema";
import { Json } from "src/common/interfaces/json.interface";

import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<Json> {
    const { email, password } = loginDto;

    const user: User = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new HttpException("이메일 혹은 비밀번호가 일치하지 않습니다.", 400);
    }

    const isPasswordCorrect: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException("이메일 혹은 비밀번호가 일치하지 않습니다.", 400);
    }

    const payload = { email, who: user.id };
    const jwt = this.jwtService.sign(payload);

    return {
      statusCode: 200,
      message: "로그인 되었습니다.",
      result: jwt,
    };
  }
}
