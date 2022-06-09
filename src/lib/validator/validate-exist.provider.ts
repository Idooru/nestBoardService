import { Injectable } from "@nestjs/common";
import { BoardRepository } from "../../model/board/repository/board.repository";
import { Types } from "mongoose";
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { UserRepository } from "../../model/user/user.repository";

@Injectable()
export class ValidateExistForValue {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async isExistBoardId(id: Types.ObjectId | string) {
    try {
      const found: boolean = await this.boardRepository.existBoardId(id);

      if (!found) {
        throw new NotFoundException(`유효하지 않은 id입니다. id: ${id}`);
      }
    } catch (err) {
      throw new BadRequestException(`잘못된 형식의 id입니다. id: ${id}`);
    }
  }

  async isExistAuthorName(name: string) {
    const found: boolean = await this.userRepository.existUserName(name);

    if (!found) {
      throw new NotFoundException(
        `유효하지 않은 사용자 이름입니다. name: ${name}`,
      );
    }
  }

  async isExistUserValue(email: string, name: string) {
    const isEmailExist: boolean = await this.userRepository.existUserEmail(
      email,
    );

    const isNameExist: boolean = await this.userRepository.existUserName(name);

    if (isEmailExist) {
      throw new ForbiddenException(`해당 이메일은 사용중입니다. ${email}`);
    } else if (isNameExist) {
      throw new ForbiddenException(`해당 이름은 사용중입니다. ${name}`);
    }
  }
}
