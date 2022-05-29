import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetDecoded = createParamDecorator(
  (data, ctx: ExecutionContext): ParameterDecorator => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
