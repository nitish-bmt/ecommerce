"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrder = placeOrder;
exports.rejectOrder = rejectOrder;
const failureConstants_1 = require("../constants/failureConstants");
const successConstants_1 = require("../constants/successConstants");
const setupMongoDb_1 = require("../setupConnections/setupMongoDb");
function placeOrder(paymentDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, setupMongoDb_1.connectDB)();
        if (db) {
            const ordersCol = db.collection("orders");
            ordersCol.updateOne({
                orderId: paymentDetails.orderId
            }, {
                $set: { "orderStatus": "PLACED" }
            });
            const paymentsCol = db.collection("payments");
            paymentsCol.insertOne(paymentDetails);
            return successConstants_1.DB_WRITE_SUCCESS;
        }
        else {
            console.log("Could not write to DB");
            return failureConstants_1.DB_FAILURE;
        }
        return failureConstants_1.DB_WRITE_FAILURE;
    });
}
function rejectOrder(orderDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, setupMongoDb_1.connectDB)();
        if (db) {
            const ordersCol = db.collection("orders");
            ordersCol.updateOne({
                orderId: orderDetails.orderId
            }, {
                $set: { "orderStatus": orderDetails.orderStatus }
            });
            return successConstants_1.DB_WRITE_SUCCESS;
        }
        else {
            console.log("Could not write to DB");
            return failureConstants_1.DB_FAILURE;
        }
        return failureConstants_1.DB_WRITE_FAILURE;
    });
}
