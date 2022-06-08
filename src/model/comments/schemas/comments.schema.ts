import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Document, SchemaOptions, Types } from "mongoose";

const option: SchemaOptions = {
  timestamps: true,
  versionKey: false,
};

@Schema(option)
export class Comments extends Document {
  @IsNotEmpty()
  @Prop({
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

  // @IsNotEmpty()
  // @IsPositive()
  // @Prop({
  //   default: 0,
  // })
  // likeCount: number;

  @IsNotEmpty()
  @Prop({
    required: true,
    ref: "boards",
  })
  whichBoard: Types.ObjectId;

  readonly readOnlyData: {
    id: Types.ObjectId;
    commenter: string;
    content: string;
    whichBoard: Types.ObjectId;
  };
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);

CommentsSchema.virtual("readOnlyData").get(function (this: Comments) {
  return {
    id: this.id,
    commenter: this.commenter,
    content: this.content,
    whichBoard: this.whichBoard,
  };
});
