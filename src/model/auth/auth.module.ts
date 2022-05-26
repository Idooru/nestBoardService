import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt", session: false }),
    JwtModule.register({ secret: "secret", signOptions: { expiresIn: "24h" } }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
