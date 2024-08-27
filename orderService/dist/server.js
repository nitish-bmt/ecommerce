"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = require("./routes/router");
//  process.env.PORT |
const PORT = 5000;
const app = (0, express_1.default)();
const ROUTE = '/orderService/v1';
app.listen(PORT, () => {
    console.log(`Server is running here: http://localhost:${PORT}${ROUTE}`);
});
app.use(ROUTE, router_1.router);
