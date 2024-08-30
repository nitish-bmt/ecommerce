import { Document, model, Schema } from "mongoose";
import { shipments } from "../utils/types";
import { validShipmentStatus } from "../utils/enums";
import dotenv from "dotenv";
dotenv.config();

interface shipmentsModelInterface extends Document, shipments{}

export const Shipments = new Schema({
  shipmentId: String,
  shipmentStatus: validShipmentStatus,
  paymentId: String,
  orderId: String,
  userId: String,
});
  
export default model<shipmentsModelInterface>(process.env.SHIPMENTS_COLLECTION!, Shipments);