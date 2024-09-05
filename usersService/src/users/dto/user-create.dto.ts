import { Exclude, Expose } from "class-transformer";
import {IsAlphanumeric, IsEmail, IsNotEmpty} from "class-validator";

// data transfer object
export class CreateUserDto{

  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  username: string;
  
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  pass: string;
}