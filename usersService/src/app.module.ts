import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [],
  controllers: [AppController, HealthcheckController, UsersController, ],
  providers: [AppService],
})
export class AppModule {}
