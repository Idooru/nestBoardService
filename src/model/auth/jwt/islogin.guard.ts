import { JwtModuleOptions, JwtService } from "@nestjs/jwt";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class IsloginGuard implements CanActivate {
  private options: JwtModuleOptions = {
    secret: process.env.JWT_SECRET,
  };

  private jwtService = new JwtService(this.options);

  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const { JWT_COOKIE } = req.cookies;

    if (!JWT_COOKIE) {
      throw new UnauthorizedException(
        "토큰이 없으므로 인증이 필요한 작업을 수행 할 수 없습니다.",
      );
    }

    req.user = this.validateToken(JWT_COOKIE);

    return true;
  }

  public validateToken(token: string) {
    try {
      const verify: string = this.jwtService.decode(token) as string;
      return verify;
    } catch (err) {
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }
  }
}
