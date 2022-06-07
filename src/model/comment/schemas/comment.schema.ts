import { Prop, SchemaFactory, SchemaOptions, Schema } from "@nestjs/mongoose";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Document, Types } from "mongoose";

const option: SchemaOptions = {
  timestamps: true,
  versionKey: false,
};

@Schema(option)
export class Comment extends Document {
  @IsNotEmpty()
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: "boards",
  })
  commenter: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @Prop({
    required: true,
  })
  content: string;

  // @IsNotEmpty()
  // @IsPositive()
  // @Prop({
  //   default: 0,
  // })
  // likeCount: number;

  @IsNotEmpty()
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: "boards",
  })
  info: Types.ObjectId;

  readonly readOnlyData: {
    id: string;
    commenter: Types.ObjectId;
    content: string;
    info: Types.ObjectId;
  };
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.virtual("readOnlyData").get(function (this: Comment) {
  return {
    id: this.id,
    commenter: this.commenter,
    content: this.content,
    info: this.info,
  };
});
