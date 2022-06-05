import { Prop, SchemaFactory, SchemaOptions, Schema } from "@nestjs/mongoose";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Document } from "mongoose";

const option: SchemaOptions = {
  timestamps: true,
  versionKey: false,
};

@Schema(option)
export class Comment extends Document {
  @IsNotEmpty()
  @IsString()
  @Prop({
    ref: "users",
    required: true,
  })
  commenter: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @Prop({
    required: true,
  })
  content: string;

  @IsNotEmpty()
  @IsString()
  @Prop({
    ref: "boards",
    required: true,
  })
  whatBoard: string;

  readonly readOnlyData: {
    id: string;
    commenter: string;
    content: string;
    whatBoard: string;
  };
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.virtual("readOnlyData").get(function (this: Comment) {
  return {
    id: this.id,
    commenter: this.commenter,
    content: this.content,
    whatBoard: this.whatBoard,
  };
});
