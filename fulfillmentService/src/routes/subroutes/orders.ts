import express from "express";
import { placeOrder } from "../../controllers/ordersController";
export const ordersRouter = express.Router();

ordersRouter.post("/placeOrder", placeOrder);
// ordersRouter.get("details", run);