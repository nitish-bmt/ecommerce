import express from "express";
import { status } from "../../controllers/healthcheckController";

export const healthcheckRouter = express.Router();

healthcheckRouter.get("/", status);