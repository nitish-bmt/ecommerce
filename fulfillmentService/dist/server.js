"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = require("./routes/router");
const dotenv_1 = require("dotenv");
const fulfillmentController_1 = require("./controllers/fulfillmentController");
(0, dotenv_1.configDotenv)();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
const ROUTE = '/paymentService/v1';
app.listen(PORT, () => {
    console.log(`Server is running here: http://localhost:${PORT}${ROUTE}`);
});
app.use(ROUTE, router_1.router);
(0, fulfillmentController_1.processFulfillment)();
