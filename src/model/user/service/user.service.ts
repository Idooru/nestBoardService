import { Injectable } from "@nestjs/common";
import { UserRequestDto } from "../dto/user-request.dto";
import { UserRepository } from "../user.repository";
import { User } from "../schemas/user.schema";
import { JwtPayload } from "../../auth/jwt/jwt-payload.interface";
import { BoardRepository } from "../../board/repository/board.repository";
import { ReadOnlyUsersDto } from "../dto/read-only-users.dto";
import { AuthService } from "../../auth/auth.service";
import { CommentRepository } from "../../comments/comments.repository";
import { ValidateExistForValue } from "../../../lib/validator/validate-exist.provider";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly boardRepository: BoardRepository,
    private readonly commentRepository: CommentRepository,
    private readonly authService: AuthService,
    private readonly validateExist: ValidateExistForValue,
  ) {}

  async register(body: UserRequestDto): Promise<ReadOnlyUsersDto> {
    const { email, name, password } = body;

    await this.validateExist.isExistUserValue(email, name);

    const hashed: string = await bcrypt.hash(password, 10);

    const user: User = await this.userRepository.createUser({
      email,
      name,
      password: hashed,
    });

    const readOnlyData: ReadOnlyUsersDto = user.readOnlyData;

    return readOnlyData;
  }

  async setUser(body: UserRequestDto, user: JwtPayload): Promise<string> {
    const { id } = user;
    const { email, name } = body;

    await this.validateExist.isExistUserValue(email, name);

    const hashed = await bcrypt.hash(body.password, 10);

    const payload = {
      email,
      name,
      password: hashed,
    };

    await this.userRepository.setUser(payload, id);

    const dataToBeJwt: JwtPayload = { id, email, name };

    const jwtToken = await this.authService.refreshTokenWhenSetUser(
      dataToBeJwt,
    );

    return jwtToken;
  }

  async secession(user: JwtPayload): Promise<void> {
    const { id } = user;
    const { name } = user;

    await this.userRepository.secession(id);
    await this.boardRepository.deleteAllBoards(name);
    await this.commentRepository.deleteComments(name);
  }
}
