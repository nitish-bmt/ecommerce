import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from "dotenv";
import { NestExpressApplication } from '@nestjs/platform-express';
// dotenv.config();
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    { abortOnError: false } // taaki app error dekr close ho; seedha 1 na de 
  );
  await app.listen(PORT);
}
bootstrap();
