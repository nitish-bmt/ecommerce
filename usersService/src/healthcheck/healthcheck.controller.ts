import { Controller, Get } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { HealthcheckDto } from './dto/healthcheck.dto';
import { HealthcheckService } from './healthcheck.service';

@Controller('healthcheck')
export class HealthcheckController {  
  constructor(private healthcheckService: HealthcheckService){}

  @Get()
  @Expose()
  handler(): HealthcheckDto{
    return this.healthcheckService.healthcheck();
  }
}
