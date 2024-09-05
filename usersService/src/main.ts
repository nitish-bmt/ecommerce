import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Validate } from 'class-validator';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
// dotenv.config();
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    { abortOnError: false } // taaki app error dekr close ho; seedha 1 na de 
  );

  // securing all endpoints
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector),{
      strategy: 'excludeAll',
      excludeExtraneousValues: true
    })
  );
  await app.listen(PORT);
}
bootstrap();
