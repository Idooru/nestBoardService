import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { UserCreateUpdateDto } from "./dto/user-create-update.dto";

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

  async create(user: UserCreateUpdateDto): Promise<User> {
    return await this.userModel.create(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async findUserById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }
}
