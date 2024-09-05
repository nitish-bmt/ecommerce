import { Prop } from "@nestjs/mongoose";
import { Expose } from "class-transformer";

export class HealthcheckDto{
  @Prop()
  @Expose()
  status: Number;

  @Prop()
  @Expose()
  message: string;
  
  @Prop()
  @Expose()
  serverUptime: string;
}