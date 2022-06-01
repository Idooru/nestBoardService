import { PickType } from "@nestjs/mapped-types";
import { Image } from "../schemas/image.schema";

export class ImageUploadDto extends PickType(Image, [
  "fileName",
  "author",
] as const) {}
