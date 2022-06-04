import { Injectable, ForbiddenException } from "@nestjs/common";
import { UserRequestDto } from "./dto/user-request.dto";
import { UserRepository } from "./user.repository";
import { Json } from "src/lib/interfaces/json.interface";
import { User } from "./schemas/user.schema";
import { JwtPayload } from "../auth/jwt/jwt-payload.interface";
import { BoardRepository } from "../board/repository/board.repository";

import * as bcrypt from "bcrypt";
import { ReadOnlyUsersDto } from "./dto/read-only-users.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  async register(payload: UserRequestDto): Promise<Json<ReadOnlyUsersDto>> {
    console.time("register");

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

    console.timeEnd("register");

    return {
      statusCode: 201,
      message: "회원가입을 완료하였습니다.",
      result: readOnlyData,
    };
  }

  async setUser(
    payload: UserRequestDto,
    user: JwtPayload,
  ): Promise<Json<null>> {
    console.time("set user");

    const id = user.id;

    await this.userRepository.setUser(payload, id);

    console.timeEnd("set user");

    return {
      statusCode: 200,
      message: "사용자 정보를 수정하였습니다.",
    };
  }

  async secession(user: JwtPayload): Promise<Json<null>> {
    console.time("secession");

    const id = user.id;
    const name = user.name;

    await this.userRepository.secession(id);
    await this.boardRepository.deleteBoards(name);

    console.timeEnd("secession");
    return {
      statusCode: 200,
      message: "회원 탈퇴를 완료하였습니다.",
    };
  }
}
