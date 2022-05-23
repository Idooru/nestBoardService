import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Document, SchemaOptions } from "mongoose";

const option: SchemaOptions = {
  autoIndex: true,
  timestamps: true,
};

@Schema(option)
export class User extends Document {
  @IsNotEmpty()
  @IsEmail()
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Prop({
    required: true,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Prop({
    required: true,
    unique: true,
  })
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
