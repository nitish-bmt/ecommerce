import { formattedServerUptime } from "../utils/healthcheck";
import { Request, Response } from "express";

export function status(req: Request, res: Response){
  res
    .status(200)
    .json({
      "status": 200,
      "message": "Server is healthy",
      "serverUptime": formattedServerUptime()
    });
}