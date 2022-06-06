import { Injectable, ForbiddenException } from "@nestjs/common";
import { UserRequestDto } from "./dto/user-request.dto";
import { UserRepository } from "./user.repository";
import { Json } from "src/lib/interfaces/json.interface";
import { User } from "./schemas/user.schema";
import { JwtPayload } from "../auth/jwt/jwt-payload.interface";
import { BoardRepository } from "../board/repository/board.repository";
import { ReadOnlyUsersDto } from "./dto/read-only-users.dto";
import { AuthService } from "../auth/auth.service";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly boardRepository: BoardRepository,
    private readonly authService: AuthService,
  ) {}

  async register(payload: UserRequestDto): Promise<Json<ReadOnlyUsersDto>> {
    const { email, name, password } = payload;

    const isEmailExist: boolean = await this.userRepository.existUserEmail(
      email,
    );

    const isNameExist: boolean = await this.userRepository.existUserName(name);

    if (isEmailExist) {
      throw new ForbiddenException(`해당 이메일은 사용중입니다. ${email}`);
    } else if (isNameExist) {
      throw new ForbiddenException(`해당 이름은 사용중입니다. ${name}`);
    }

    const hashed: string = await bcrypt.hash(password, 10);

    const user: User = await this.userRepository.createUser({
      email,
      name,
      password: hashed,
    });

    const readOnlyData: ReadOnlyUsersDto = user.readOnlyData;

    return {
      statusCode: 201,
      message: "회원가입을 완료하였습니다.",
      result: readOnlyData,
    };
  }

  async setUser(
    payload: UserRequestDto,
    user: JwtPayload,
  ): Promise<Json<string>> {
    const id = user.id;

    const hashed = await bcrypt.hash(payload.password, 10);

    const changedPayload = {
      email: payload.email,
      name: payload.name,
      password: hashed,
    };

    await this.userRepository.setUser(changedPayload, id);

    const email = payload.email;
    const name = payload.name;

    const dataToBeJwt: JwtPayload = { id, email, name };

    const jwtToken = await this.authService.refreshTokenWhenSetUser(
      dataToBeJwt,
    );

    return {
      statusCode: 200,
      message: "사용자 정보를 수정하고 토큰을 재발급합니다.",
      result: jwtToken,
    };
  }

  async secession(user: JwtPayload): Promise<Json<null>> {
    const id = user.id;
    const name = user.name;

    await this.userRepository.secession(id);
    await this.boardRepository.deleteBoards(name);

    return {
      statusCode: 200,
      message: "회원 탈퇴를 완료하였습니다.",
    };
  }
}
