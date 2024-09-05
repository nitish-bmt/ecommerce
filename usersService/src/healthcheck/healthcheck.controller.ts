import { Controller, Get } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { formattedServerUptime } from 'src/utils/healthcheck';

@Controller('healthcheck')
export class HealthcheckController {
  
  @Get()
  @Expose()
  systemUptime(): object{
    return ({
      status: 200,
      desc: "All OK",
      serverUptime: formattedServerUptime()
    });
  }
}
