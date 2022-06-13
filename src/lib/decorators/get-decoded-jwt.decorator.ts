import { createParamDecorator, ArgumentsHost } from "@nestjs/common";

export const GetDecodedJwt = createParamDecorator(
  (data, ctx: ArgumentsHost): ParameterDecorator => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
