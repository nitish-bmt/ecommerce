import express from "express";
import { healthcheckRouter } from "./subroutes/healthcheck";
import { ordersRouter } from "./subroutes/orders"
export const router = express.Router();

router.use("/healthcheck", healthcheckRouter);
router.use("/orders", ordersRouter);
