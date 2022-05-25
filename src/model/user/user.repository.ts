import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async existUserEmail(email: string): Promise<boolean> {
    return this.userModel.exists({ email });
  }

  public async existUserName(name: string): Promise<boolean> {
    return this.userModel.exists({ name });
  }

  public async create(user: RegisterDto): Promise<User> {
    return this.userModel.create(user);
  }

  public async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }
}
