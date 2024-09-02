import { Controller, Get } from '@nestjs/common';
import { formattedServerUptime } from 'src/utils/healthcheck';

@Controller('healthcheck')
export class HealthcheckController {
  
  @Get()
  systemUptime(): object{
    return ({
      status: 200,
      desc: "All OK",
      serverUptime: formattedServerUptime()
    });
  }
}
