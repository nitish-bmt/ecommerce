import { Request, Response } from "express";
import { setupChannel } from "../utils/setupConnections/setupRabbitMq";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
dotenv.config();

export async function placeOrder(req: Request, res: Response){
  
  // order generate kiya
  const orderRequested = req.body;
  // console.log(orderRequested);
  const orderId = uuidv4();
  const orderDetails = {orderId: orderId, ...orderRequested, orderStaus: "pending"};
  // console.log(orderDetails);
  
  // order sent to queue
  // Buffer me conversion not needed
  const channel = await setupChannel();
  channel.sendToQueue(process.env.QUEUE||"", Buffer.from(JSON.stringify(orderDetails)));


  
  res
    .status(200)
    .json({
      requestStatus: "waiting for payment",
      details: orderDetails
    })
}