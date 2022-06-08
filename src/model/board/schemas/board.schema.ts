import { SchemaOptions, Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { Comments } from "src/model/comments/schemas/comments.schema";

const option: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
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
    ref: "Images",
  })
  imgUrls: Array<string>;

  readonly readOnlyData: {
    id: Types.ObjectId;
    title: string;
    author: string;
    description: string;
    isPublic: boolean;
    imgUrls: Array<string>;
    commentList: Comments[];
  };

  readonly commentList: Comments[];
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
    commentList: this.commentList,
  };
});

_BoardSchema.virtual("commentList", {
  ref: "comments",
  localField: "_id",
  foreignField: "whichBoard",
});
_BoardSchema.set("toObject", { virtuals: true });
_BoardSchema.set("toJSON", { virtuals: true });

export const BoardSchema = _BoardSchema;
