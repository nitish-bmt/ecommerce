import express from "express";
import { healthcheckRouter } from "./subroutes/healthcheck";
export const router = express.Router();

router.use("/healthcheck", healthcheckRouter);
