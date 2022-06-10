import { SchemaOptions, Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Comments } from "src/model/comments/schemas/comments.schema";

const option: SchemaOptions = {
  timestamps: true,
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
  @MaxLength(100)
  @MinLength(3)
  @Prop({
    required: true,
  })
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  @Prop({
    required: true,
  })
  isPublic: boolean;

  @IsArray()
  @Prop({
    required: true,
  })
  imageList: Array<string>;

  readonly comments_detail: Comments[];

  readonly readOnlyData: {
    id: Types.ObjectId;
    title: string;
    author: string;
    description: string;
    isPublic: boolean;
    imageList: Array<string>;
    comments_detail: Comments[];
  };
}

const _BoardSchema = SchemaFactory.createForClass(Board);

_BoardSchema.virtual("readOnlyData").get(function (this: Board) {
  return {
    id: this.id,
    title: this.title,
    author: this.author,
    description: this.description,
    isPublic: this.isPublic,
    imgUrl: this.imageList,
    comments_detail: this.comments_detail,
  };
});

_BoardSchema.virtual("comments_detail", {
  ref: "comments",
  localField: "_id",
  foreignField: "whichBoard",
});

_BoardSchema.set("toObject", { virtuals: true });
_BoardSchema.set("toJSON", { virtuals: true });

export const BoardSchema = _BoardSchema;
