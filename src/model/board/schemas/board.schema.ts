import { SchemaOptions, Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

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
    unique: true,
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

  readonly readOnlyData: {
    id: string;
    title: string;
    author: string;
    description: string;
  };
}

export const BoardSchema = SchemaFactory.createForClass(Board);

BoardSchema.virtual("readOnlyData").get(function (this: Board) {
  return {
    id: this.id,
    title: this.title,
    author: this.author,
    description: this.description,
  };
});
