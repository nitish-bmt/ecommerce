import { Prop } from "@nestjs/mongoose";
import { Expose } from "class-transformer";
import { IsEmail, isEmail, IsNotEmpty } from "class-validator";

export class SafeTransferUserDto{

  @Prop()
  @IsNotEmpty()
  @Expose()
  name: string;

  @Prop()
  @IsNotEmpty()
  @Expose()
  username: string;

  @Prop()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;
}