import { Controller, Module } from "@nestjs/common";
import { HealthcheckController } from "./healthcheck.controller";
import { HealthcheckService } from "./healthcheck.service";

@Module({
  imports: [],
  controllers: [HealthcheckController],
  providers: [HealthcheckService],
  exports: [HealthcheckService]
})
export class healthcheckModule {}