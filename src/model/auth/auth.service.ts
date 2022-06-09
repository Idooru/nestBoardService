import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { User } from "../user/schemas/user.schema";
import { JwtPayload } from "./jwt/jwt-payload.interface";
import { Types } from "mongoose";

import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: LoginDto): Promise<string> {
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
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const jwtToken: string = this.jwtService.sign(dataToBeJwt);

    return jwtToken;
  }

  async refreshTokenWhenLogin(decryptedToken: JwtPayload): Promise<string> {
    const id: string = decryptedToken.id;
    const user: User = await this.userRepository.findUserById(id);

    const { email, name } = user;

    const dataToBeJwt: JwtPayload = { id, email, name };
    const jwtToken: string = this.jwtService.sign(dataToBeJwt);

    return jwtToken;
  }

  async refreshTokenWhenSetUser(dataToBeJwt: JwtPayload): Promise<string> {
    return this.jwtService.sign(dataToBeJwt);
  }
}
