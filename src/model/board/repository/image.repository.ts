import { InjectModel } from "@nestjs/mongoose";
import { Image } from "../schemas/image.schema";
import { Model } from "mongoose";
import { ImageUploadDto } from "../dto/image-upload.dto";
import { ImageReturnDto } from "../dto/image-return.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ImageRepository {
  constructor(@InjectModel("images") readonly imageModel: Model<Image>) {}

  async uploadImg(image: ImageUploadDto): Promise<ImageReturnDto> {
    const fileNameOnUrl = `http://localhost:8001/media/${image.fileName}`;

    await this.imageModel.create({
      fileName: fileNameOnUrl,
      author: image.author,
      originalName: image.originalName,
    });

    return { name: image.originalName, url: fileNameOnUrl };
  }
}
