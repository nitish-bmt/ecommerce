import { Request, Response } from "express";
import { setupChannel } from "../utils/setupConnections/setupRabbitMq";
import { PAYMENT_FAILURE, RABBIT_CONSUMER_FAILURE, RABBIT_FAILURE, UNFULFILLED } from "../utils/constants/failureConstants";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
import { order, paidOrder, shipment } from "../utils/types";
import { Channel } from "amqplib";
import { placeOrder, rejectOrder } from "../utils/dbOperations/paymentOperations";
import { PAYMENT_SUCCESS, FULFILLED } from "../utils/constants/successConstants";
import { addShipment, updateShipmentStatusFailure, updateShipmentStatusSuccess } from "../utils/dbOperations/shipmentOperations";
dotenv.config();

const orderQueue = process.env.ORDER_QUEUE || "orders";
const paymentQueue = process.env.PAYMENT_QUEUE || "payments";
const shippedQueue = process.env.SHIPPED_QUEUE || "shipped";
export async function notifyUser() {

  try{

    const channel = await setupChannel();
    channel.assertQueue(shippedQueue);
    
    await channel.consume(shippedQueue, (msg)=>sendMail(msg?.content||null), {noAck: true});
  }
  catch(error){
    console.error(RABBIT_CONSUMER_FAILURE);
    console.log(error);
  }

}

export async function sendMail( shipmentBuffer: Buffer|null) {
  
  if(shipmentBuffer){

    // MOCK EMAIL
    const shipmentDetails: shipment = JSON.parse(shipmentBuffer.toString());
    console.log(`Order no: ${shipmentDetails.orderId} for user: ${shipmentDetails.userId} has been shipped with shipment id: ${shipmentDetails.shipmentId}`)

    
  }
  else{
    console.log("ORDER QUEUE EMPTY");
  }

}