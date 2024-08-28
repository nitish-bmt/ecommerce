import { Request, Response } from "express";
import { setupChannel } from "../utils/setupConnections/setupRabbitMq";
import { RABBIT_CONSUMER_FAILURE, RABBIT_FAILURE } from "../utils/constants/failureConstants";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
import { order } from "../utils/types";
dotenv.config();

const orderQueue = process.env.ORDER_QUEUE || "orders";
const paymentQueue = process.env.PAYMENT_QUEUE || "payments";

export async function processPayment(req: Request, res: Response) {

  const channel = await setupChannel();
  
  channel.assertQueue(orderQueue);
  const consumedData = await channel.consume(orderQueue, (msg)=>addToPaymentQueue(msg?.content||null), {noAck: true});
  if(consumedData.consumerTag){
    console.log(consumedData);
  }
  else{
    console.log("it is null");
  }
  res
    .status(200)
    .send((consumedData));

  // if (orderDetails !== null) {

  //   res
  //     .status(200)
  //     .send((orderDetails));
  // }
  // else {
  //   res
  //     .status(200)
  //     .send("empty queue");
  // }
}

export async function addToPaymentQueue(orderDetails: Buffer|null) {

  if(orderDetails){
    console.log(orderDetails.toString());

    try {
      const channel = await setupChannel();

      channel.assertQueue(paymentQueue);
      channel.sendToQueue(paymentQueue, orderDetails);

    }
    catch (err) {
      console.log(RABBIT_FAILURE);
    }
  }
  else{
    console.log(RABBIT_CONSUMER_FAILURE);
  }

}