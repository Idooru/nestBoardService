import { Injectable } from "@nestjs/common";
import { ImageRepository } from "../repository/image.repository";
import { JwtPayload } from "src/model/auth/jwt/jwt-payload.interface";
import { ImageReturnDto } from "../dto/image-return.dto";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  async uploadImg(
    files: Array<Express.Multer.File>,
    user: JwtPayload,
  ): Promise<ImageReturnDto[]> {
    const imgUrls: ImageReturnDto[] = [];
    const author = user.name;

    if (!files.length) {
      throw new BadRequestException(
        "사진을 업로드 할 수 없습니다. 사진을 제시해주세요.",
      );
    } else if (files.length >= 2) {
      for (const index of files) {
        const fileName = index.filename;
        const originalName = index.originalname;
        imgUrls.push(
          await this.imageRepository.uploadImg({
            fileName,
            author,
            originalName,
          }),
        );
      }
    } else {
      const fileName = files[0].filename;
      const originalName = files[0].originalname;

      imgUrls.push(
        await this.imageRepository.uploadImg({
          fileName,
          author,
          originalName,
        }),
      );
    }

    return imgUrls;
  }
}
