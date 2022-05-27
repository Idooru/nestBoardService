import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { UserRepository } from "../../user/user.repository";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtStuff } from "./jwt-stuff.interface";
import { User } from "src/modules/user/schemas/user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "secret",
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtStuff, done: VerifiedCallback) {
    const id: { id: string } = payload.who;
    const user: User = await this.userRepository.findUserById(id);

    if (!user) {
      throw new UnauthorizedException("해당 사용자는 존재하지 않습니다.");
    }

    return done(null, user);
  }
}
