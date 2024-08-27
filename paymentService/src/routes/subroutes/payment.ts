import express from "express";
import { processPayment } from "../../controllers/paymentsController";
export const paymentsRouter = express.Router();

paymentsRouter.post("/payNow", processPayment);
// ordersRouter.get("details", run);