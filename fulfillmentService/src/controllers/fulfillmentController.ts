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

export async function processFulfillment() {

  try{

    const channel = await setupChannel();
    channel.assertQueue(paymentQueue);
    
    // consume the data from "order" queue and
    // add it to mongo db
    // and also add ti in payments queue for fulfillment queue to consume
    await channel.consume(paymentQueue, (msg)=>addToFulfilledQueue( channel, msg?.content||null), {noAck: true});
  }
  catch(error){
    console.error(RABBIT_CONSUMER_FAILURE);
    console.log(error);
  }

}

export async function addToFulfilledQueue( channel: Channel ,orderBuffer: Buffer|null) {
  
  if(orderBuffer){

    // MOCK PAYMENT
    const orderDetails: paidOrder = JSON.parse(orderBuffer.toString());
    const shipmentDetails: shipment = {shipmentId: uuidv4(), shipmentStatus: "ON THE WAY", ...orderDetails}
    
    addShipment(shipmentDetails);

    shipmentSuccessful(shipmentDetails)
      .then((isSuccessful)=>{
        if(isSuccessful){
          shipmentDetails.orderStatus = "DELIVERED";
          shipmentDetails.shipmentStatus = "SHIPPED";
          console.log(FULFILLED, shipmentDetails.orderId);
          updateShipmentStatusSuccess(shipmentDetails);
        }
        else{
          shipmentDetails.shipmentStatus = "DEAD";
          console.error(UNFULFILLED, shipmentDetails.orderId);
          updateShipmentStatusFailure(shipmentDetails);
        }
      })
      .catch((error)=>{
        shipmentDetails.shipmentStatus = "DEAD";
        console.error(UNFULFILLED, shipmentDetails.orderId);
        updateShipmentStatusFailure(shipmentDetails);
        console.log(error);
      })
  }
  else{
    console.log("ORDER QUEUE EMPTY");
  }

}

// mock shipment
async function shipmentSuccessful(shipmentDetails: shipment): Promise<boolean>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve(true);
    }, 14999);
  });
}