import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Document, Types, SchemaOptions } from "mongoose";

const option: SchemaOptions = {
  timestamps: true,
  versionKey: false,
};

@Schema(option)
export class Comments extends Document {
  @IsNotEmpty()
  @Prop({
    type: Types.ObjectId,
    required: true,
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

export const CommentsSchema = SchemaFactory.createForClass(Comments);

CommentsSchema.virtual("readOnlyData").get(function (this: Comments) {
  return {
    id: this.id,
    commenter: this.commenter,
    content: this.content,
    info: this.info,
  };
});
