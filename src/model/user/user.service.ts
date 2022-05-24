import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { RegisterDto } from "./dto/login.dto";
import { Json } from "../../common/interfaces/json.interface";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<Json> {
    const { email, password, name } = registerDto;

    const isEmailExist: boolean = await this.userModel.exists({ email });
    const isNameExist: boolean = await this.userModel.exists({ name });

    if (isEmailExist || isNameExist) {
      throw new BadRequestException("사용자가 이미 존재합니다.");
    }

    const hashed: string = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      email,
      name,
      password: hashed,
    });

    return {
      success: true,
      statusCode: 201,
      message: "회원가입을 완료하였습니다.",
      result: user,
    };
  }
}
