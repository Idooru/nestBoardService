import { SchemaOptions, Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

const option: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(option)
export class Board extends Document {
  @IsNotEmpty()
  @IsString()
  @Prop({
    required: true,
    length: 20,
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @Prop({
    required: true,
  })
  author: string;

  @IsNotEmpty()
  @IsString()
  @Prop({
    required: true,
    length: 100,
  })
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  @Prop({
    required: true,
  })
  isPublic: boolean;

  @IsString()
  @Prop({
    default: "no image",
  })
  imgName?: string | string[] | null;

  @IsString()
  @Prop({
    default: "no image url",
  })
  imgUrl?: string | string[] | null;

  @IsNotEmpty()
  @IsString()
  @Prop({
    required: true,
  })
  whenCreated: string;

  @IsString()
  @Prop({
    default: "not yet",
  })
  whenUpdated?: string | null;

  readonly readOnlyDataMultiple: {
    id: string;
    title: string;
    author: string;
    description: string;
    whenCreated: string;
    whenUpated: string;
  };

  readonly readOnlyDataSingle: {
    id: string;
    title: string;
    author: string;
    description: string;
    isPublic: boolean;
    imgUrl: string | string[] | null;
    whenCreated: string;
    whenUpated: string;
  };
}

export const BoardSchema = SchemaFactory.createForClass(Board);

BoardSchema.virtual("readOnlyDataMultiple").get(function (this: Board) {
  return {
    id: this.id,
    title: this.title,
    author: this.author,
    description: this.description,
    imgName: this.imgName,
    imgUrl: this.imgUrl,
    whenCreated: this.whenCreated,
    whenUpdated: this.whenUpdated,
  };
});

BoardSchema.virtual("readOnlyDataSingle").get(function (this: Board) {
  return {
    id: this.id,
    title: this.title,
    author: this.author,
    description: this.description,
    isPublic: this.isPublic,
    imgName: this.imgName,
    imgUel: this.imgUrl,
    whenCreated: this.whenCreated,
    whenUpdated: this.whenUpdated,
  };
});
