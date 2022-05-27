import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async existUserEmail(email: string): Promise<boolean> {
    return await this.userModel.exists({ email });
  }

  async existUserName(name: string): Promise<boolean> {
    return await this.userModel.exists({ name });
  }

  async create(user: RegisterDto): Promise<User> {
    return await this.userModel.create(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }
}
