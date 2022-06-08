import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Document, Types } from "mongoose";

const option: SchemaOptions = {
  timestamps: true,
  versionKey: false,
};

@Schema(option)
export class User extends Document {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Prop({
    required: true,
  })
  password: string;

  readonly readOnlyData: {
    id: Types.ObjectId;
    email: string;
    name: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual("readOnlyData").get(function (this: User) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
  };
});
