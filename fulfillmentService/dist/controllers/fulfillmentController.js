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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFulfillment = processFulfillment;
exports.addToFulfilledQueue = addToFulfilledQueue;
const setupRabbitMq_1 = require("../utils/setupConnections/setupRabbitMq");
const failureConstants_1 = require("../utils/constants/failureConstants");
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const successConstants_1 = require("../utils/constants/successConstants");
const shipmentOperations_1 = require("../utils/dbOperations/shipmentOperations");
dotenv_1.default.config();
const orderQueue = process.env.ORDER_QUEUE || "orders";
const paymentQueue = process.env.PAYMENT_QUEUE || "payments";
function processFulfillment() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const channel = yield (0, setupRabbitMq_1.setupChannel)();
            channel.assertQueue(paymentQueue);
            // consume the data from "order" queue and
            // add it to mongo db
            // and also add ti in payments queue for fulfillment queue to consume
            yield channel.consume(paymentQueue, (msg) => addToFulfilledQueue(channel, (msg === null || msg === void 0 ? void 0 : msg.content) || null), { noAck: true });
        }
        catch (error) {
            console.error(failureConstants_1.RABBIT_CONSUMER_FAILURE);
            console.log(error);
        }
    });
}
function addToFulfilledQueue(channel, orderBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        if (orderBuffer) {
            // MOCK PAYMENT
            const orderDetails = JSON.parse(orderBuffer.toString());
            const shipmentDetails = Object.assign({ shipmentId: (0, uuid_1.v4)(), shipmentStatus: "ON THE WAY" }, orderDetails);
            (0, shipmentOperations_1.addShipment)(shipmentDetails);
            shipmentSuccessful(shipmentDetails)
                .then((isSuccessful) => {
                if (isSuccessful) {
                    shipmentDetails.orderStatus = "DELIVERED";
                    shipmentDetails.shipmentStatus = "SHIPPED";
                    console.log(successConstants_1.SHIPMENT_SUCCESS);
                    (0, shipmentOperations_1.updateShipmentStatusSuccess)(shipmentDetails);
                }
                else {
                    shipmentDetails.shipmentStatus = "DEAD";
                    console.log(failureConstants_1.SHIPMENT_FAILURE);
                    (0, shipmentOperations_1.updateShipmentStatusFailure)(shipmentDetails);
                }
            })
                .catch((error) => {
                shipmentDetails.shipmentStatus = "DEAD";
                console.error(failureConstants_1.SHIPMENT_FAILURE);
                (0, shipmentOperations_1.updateShipmentStatusFailure)(shipmentDetails);
                console.log(error);
            });
        }
        else {
            console.log("ORDER QUEUE EMPTY");
        }
    });
}
// mock shipment
function shipmentSuccessful(shipmentDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 14999);
        });
    });
}
