import { Document, model, Schema } from "mongoose";
import { payments } from "../utils/types";
import { validPaymentStatus } from "../utils/enums";


export interface paymentsModelInterface extends Document, payments{}

export const Payments = new Schema({
  paymentId: String,
  orderId: String,
  userId: String,
  paymentStatus: validPaymentStatus,
});

export default model<paymentsModelInterface>(process.env.PAYMENTS_COLLECTION!, Payments);