import { SchemaOptions, Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { Comment } from "src/model/comment/schemas/comment.schema";

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

  @IsArray()
  @Prop({
    ref: "images",
  })
  imgUrls: Array<string>;

  readonly readOnlyData: {
    id: string;
    title: string;
    author: string;
    description: string;
    isPublic: boolean;
    imgUrls: Array<string>;
    comments: Array<Comment>;
  };

  readonly comments: Array<Comment>;
}

const _BoardSchema = SchemaFactory.createForClass(Board);

_BoardSchema.virtual("readOnlyData").get(function (this: Board) {
  return {
    id: this.id,
    title: this.title,
    author: this.author,
    description: this.description,
    isPublic: this.isPublic,
    imgUrl: this.imgUrls,
    comments: this.comments,
  };
});

_BoardSchema.virtual("CommentList", {
  ref: "comments",
  localField: "id",
  foreignField: "whichBoard",
});
_BoardSchema.set("toObject", { virtuals: true });
_BoardSchema.set("toJSON", { virtuals: true });

export const BoardSchema = _BoardSchema;
