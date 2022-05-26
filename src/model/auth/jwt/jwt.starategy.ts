// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly)
// }

// import { ExtractJwt, Strategy } from "passport-jwt";
// import { PassportStrategy } from "@nestjs/passport";
// import { UserRepository } from "../../user/user.repository";
// import { Injectable } from "@nestjs/common";

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly userRepository: UserRepository) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: "secret",
//       ignoreExpiration: false,
//     });
//   }
// }
