import { Document, model, Schema } from "mongoose";
import { orders } from "../utils/types";
import { validOrderStatus } from "../utils/enums";

export interface ordersModelInterface extends Document, orders{}

export const Orders = new Schema({
  orderId: String,
  userId: String,
  orderItems: [
    {
      productId: String,
      productQty: Number,
      productPrice: Number,
    },
  ],
  orderStatus: validOrderStatus,
});

export default model<ordersModelInterface>(process.env.PAYMENTS_COLLECTION!, Orders);