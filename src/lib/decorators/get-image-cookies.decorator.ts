import { createParamDecorator, ArgumentsHost } from "@nestjs/common";

export const GetImageCookies = createParamDecorator(
  (data, ctx: ArgumentsHost): ParameterDecorator => {
    const req = ctx.switchToHttp().getRequest();
    const images = req.cookies;

    for (const i in images) {
      if (images[i].inclues("/uploads")) {
        console.log("Hello!");
      }
    }

    return;
  },
);
