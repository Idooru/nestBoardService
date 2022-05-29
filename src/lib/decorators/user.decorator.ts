import { createParamDecorator, ArgumentsHost } from "@nestjs/common";

export const GetDecoded = createParamDecorator(
  (data, ctx: ArgumentsHost): ParameterDecorator => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
