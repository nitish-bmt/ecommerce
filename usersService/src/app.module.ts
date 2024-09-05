import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { healthcheckModule } from './healthcheck/healthcheck.module';
import { HealthcheckService } from './healthcheck/healthcheck.service';

@Module({
  imports: [
    ConfigModule.forRoot(), //for .env
    MongooseModule.forRoot(process.env.MONGO_ECOMM_STRING), 
    UsersModule,
    healthcheckModule,
  ],
  controllers: [AppController, HealthcheckController, UsersController, ],
  providers: [AppService, UsersService, HealthcheckService, ],
})
export class AppModule {}
