import { Prop } from "@nestjs/mongoose";
import { Exclude, Expose } from "class-transformer";
import {IsAlphanumeric, IsEmail, IsNotEmpty} from "class-validator";

// data transfer object
export class CreateUserDto{

  @Prop()
  @Expose()
  @IsNotEmpty()
  name: string;

  @Prop()
  @Expose()
  @IsNotEmpty()
  username: string;
  
  @Prop()
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop()
  @IsNotEmpty()
  pass: string;
}