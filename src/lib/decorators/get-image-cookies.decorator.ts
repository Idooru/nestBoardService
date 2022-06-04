import { createParamDecorator, ArgumentsHost } from "@nestjs/common";
import { ImageReturnDto } from "../../model/board/dto/image-return.dto";

export const GetImageCookies = createParamDecorator(
  (data, ctx: ArgumentsHost): Array<ImageReturnDto> => {
    const req = ctx.switchToHttp().getRequest();

    delete req.cookies.JWT_COOKIE;

    const { ...images } = req.cookies;
    const imgUrls: Array<ImageReturnDto> = [];

    for (const idx in images) {
      imgUrls.push({ name: idx, url: images[idx] });
    }

    return imgUrls;
  },
);
