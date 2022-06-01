import { InjectModel } from "@nestjs/mongoose";
import { Image } from "../schemas/image.schema";
import { Model } from "mongoose";
import { ImageUploadDto } from "../dto/image-upload.dto";

export class ImageRepository {
  constructor(@InjectModel("Image") readonly imageModel: Model<Image>) {}

  async uploadImg(image: ImageUploadDto): Promise<string> {
    const fileNameOnUrl = `http://localhost:8001/uploads/${image.fileName}`;

    await this.imageModel.create({
      fileName: fileNameOnUrl,
      author: image.author,
    });

    return fileNameOnUrl;
  }
}
