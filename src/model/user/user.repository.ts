import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { UserCreateUpdateDto } from "./dto/user-create-update.dto";
import { Types } from "mongoose";

@Injectable()
export class UserRepository {
  constructor(@InjectModel("users") readonly userModel: Model<User>) {}

  async existUserEmail(email: string): Promise<boolean> {
    return await this.userModel.exists({ email });
  }

  async existUserName(name: string): Promise<boolean> {
    return await this.userModel.exists({ name });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async findUserById(id: Types.ObjectId): Promise<User> {
    return await this.userModel.findById(id);
  }

  async createUser(user: UserCreateUpdateDto): Promise<User> {
    return await this.userModel.create(user);
  }

  async setUser(user: UserCreateUpdateDto, id: Types.ObjectId): Promise<void> {
    await this.userModel.updateOne({ _id: id }, user);
  }

  async secession(id: Types.ObjectId): Promise<void> {
    await this.userModel.deleteOne({ _id: id });
  }
}
