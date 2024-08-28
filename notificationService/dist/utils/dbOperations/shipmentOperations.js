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
exports.addShipment = addShipment;
exports.updateShipmentStatusSuccess = updateShipmentStatusSuccess;
exports.updateShipmentStatusFailure = updateShipmentStatusFailure;
const failureConstants_1 = require("../constants/failureConstants");
const successConstants_1 = require("../constants/successConstants");
const setupMongoDb_1 = require("../setupConnections/setupMongoDb");
function addShipment(shipmentDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, setupMongoDb_1.connectDB)();
        if (db) {
            // const ordersCol =  db.collection("shipment");
            // ordersCol.updateOne(
            //   { 
            //     orderId: paymentDetails.orderId
            //   },
            //   {
            //     $set: {"orderStatus": "PLACED"}
            //   },
            //   // {upsert: true} //not sure if i should do this
            // );
            const shipmentsCol = db.collection("shipments");
            shipmentsCol.insertOne(shipmentDetails);
            return successConstants_1.DB_WRITE_SUCCESS;
        }
        else {
            console.log("Could not write to DB");
            return failureConstants_1.DB_FAILURE;
        }
        return failureConstants_1.DB_WRITE_FAILURE;
    });
}
function updateShipmentStatusSuccess(shipmentDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, setupMongoDb_1.connectDB)();
        if (db) {
            const ordersCol = db.collection("orders");
            const shipmentsCol = db.collection("shipments");
            ordersCol.updateOne({
                orderId: shipmentDetails.orderId
            }, {
                $set: {
                    "orderStatus": shipmentDetails.orderStatus
                }
            });
            shipmentsCol.updateOne({
                shipmentId: shipmentDetails.shipmentId
            }, {
                $set: {
                    "shipmentStatus": shipmentDetails.shipmentStatus,
                    "orderStatus": shipmentDetails.orderStatus
                }
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
function updateShipmentStatusFailure(shipmentDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, setupMongoDb_1.connectDB)();
        if (db) {
            const shipmentsCol = db.collection("shipments");
            shipmentsCol.updateOne({
                shipmentId: shipmentDetails.shipmentId
            }, {
                $set: {
                    "shipmentStatus": shipmentDetails.shipmentStatus,
                }
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
