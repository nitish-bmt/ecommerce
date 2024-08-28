import express from "express";
import { healthcheckRouter } from "./subroutes/healthcheck";
import { paymentsRouter } from "./subroutes/payment"
export const router = express.Router();

router.use("/healthcheck", healthcheckRouter);
// router.use("/payments", paymentsRouter);
