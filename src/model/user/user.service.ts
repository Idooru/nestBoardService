import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { Json } from "../../common/interfaces/json.interface";
import { UserRepository } from "./user.repository";
import { User } from "./schemas/user.schema";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(registerDto: RegisterDto): Promise<Json> {
    const { email, password, name } = registerDto;

    const isEmailExist: boolean = await this.userRepository.existUserEmail(
      email,
    );
    const isNameExist: boolean = await this.userRepository.existUserName(name);

    if (isEmailExist || isNameExist) {
      throw new BadRequestException("사용자가 이미 존재합니다.");
    }

    const hashed: string = await bcrypt.hash(password, 10);

    const user: User = await this.userRepository.create({
      email,
      name,
      password: hashed,
    });

    return {
      statusCode: 201,
      message: "회원가입을 완료하였습니다.",
      result: user.readOnlyData,
    };
  }
}
