import { Inject, Injectable } from "@nestjs/common";
import { HealthcheckDto } from "./dto/healthcheck.dto";
import { InstanceLinksHost } from "@nestjs/core/injector/instance-links-host";

@Injectable()
export class HealthcheckService{

  // constructor(
  //   @Inject()
  //   private healthResponse: HealthcheckDto
  // ){}
  
  healthcheck(): HealthcheckDto{
    const healthResponse = new HealthcheckDto;
    healthResponse.status = 200;
    healthResponse.message = "All OK";
    healthResponse.serverUptime = this.formattedServerUptime();
    return healthResponse;
  }
  
  formattedServerUptime(): string{
    const uptime = process.uptime();
    return `${Math.floor(uptime/(60*60))}hrs ${Math.floor((uptime%(60*60))/60)}mins ${Math.floor(uptime%60)}secs`;
  }

}
