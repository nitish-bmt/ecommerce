import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude, Expose } from "class-transformer";
import { IsAlphanumeric, IsEmail, IsNotEmpty } from "class-validator";
import { HydratedDocument } from "mongoose";

// export type UserDocument = HydratedDocument<User>;

@Schema()
export class User{

  // property decorator
  @Prop()
  @Expose()
  name: string;

  @Prop()
  @Expose()
  username: string;

  @Prop()
  @Expose()
  email: string;

  @Prop()
  // @Expose()
  pass: string;
}

export const UserSchema = SchemaFactory.createForClass(User);