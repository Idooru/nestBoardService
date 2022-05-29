import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { IsloginGuard } from "./jwt/islogin.guard";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(IsloginGuard)
  @Get("/whoami")
  whoAmI() {
    return this.authService.whoAmI();
  }
}
