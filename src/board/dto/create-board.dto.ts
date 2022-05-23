import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: true;
}
