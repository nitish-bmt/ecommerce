"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthcheckRouter = void 0;
const express_1 = __importDefault(require("express"));
const healthcheckController_1 = require("../../controllers/healthcheckController");
exports.healthcheckRouter = express_1.default.Router();
exports.healthcheckRouter.get("/", healthcheckController_1.status);
