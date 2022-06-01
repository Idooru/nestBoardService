import { InjectModel } from "@nestjs/mongoose";
import { Image } from "../schemas/image.schema";
import { Model } from "mongoose";
import { ImageUploadDto } from "../dto/image-upload.dto";

export class ImageRepository {
  constructor(@InjectModel("Image") readonly imageModel: Model<Image>) {}

  async uploadImg(image: ImageUploadDto): Promise<Image> {
    return await this.imageModel.create(image);
  }

  async findImgUrlByName(imgName: string): Promise<Image> {
    return await this.imageModel.findOne().where("filename").equals(imgName);
  }
}
