import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { Json } from "src/common/interfaces/json.interface";
import { User } from "../user/schemas/user.schema";
import { JwtStuff } from "./jwt/jwt-stuff.interface";
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

    const stuffByJwt: JwtStuff = {
      email,
      who: { id: user.id, name: user.name },
    };
    const jwtToken: string = this.jwtService.sign(stuffByJwt);

    console.timeEnd("login");

    return {
      statusCode: 200,
      message: "로그인에 성공하였습니다.",
      result: jwtToken,
    };
  }
}
