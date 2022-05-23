import { SchemaOptions, Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

const option: SchemaOptions = {
  autoIndex: true,
  timestamps: true,
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
    length: 300,
  })
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  @Prop({
    required: true,
  })
  isPublic: Boolean;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
