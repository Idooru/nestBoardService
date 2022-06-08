import { Types } from "mongoose";
import { BoardRepository } from "../../model/board/repository/board.repository";
import { UserRepository } from "../../model/user/user.repository";

export class Exist {
  constructor(
    private readonly boardRepository?: BoardRepository,
    private readonly userRepository?: UserRepository,
  ) {}

  async isExistId(id: Types.ObjectId | string): Promise<boolean> {
    return await this.boardRepository.existBoardId(id);
  }

  async isExistName(name: string): Promise<boolean> {
    return await this.userRepository.existUserName(name);
  }
}
