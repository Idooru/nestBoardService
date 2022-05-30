import { Injectable, ForbiddenException } from "@nestjs/common";
import { UserRequestDto } from "./dto/user-request.dto";
import { UserRepository } from "./user.repository";
import { Json } from "src/lib/interfaces/json.interface";
import { User } from "./schemas/user.schema";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(payload: UserRequestDto): Promise<Json> {
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

    const user: User = await this.userRepository.create({
      email,
      name,
      password: hashed,
    });

    console.timeEnd("register");

    return {
      statusCode: 201,
      message: "회원가입을 완료하였습니다.",
      result: user.readOnlyData,
    };
  }
}
