import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Document, SchemaOptions } from "mongoose";

const option: SchemaOptions = {
  autoIndex: true,
  timestamps: true,
};

@Schema(option)
export class User extends Document {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(20)
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
  @MaxLength(13)
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  readonly readOnlyData: { id: string; email: string; name: string };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual("readOnlyData").get(function (this: User) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
  };
});
