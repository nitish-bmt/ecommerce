import { Request, Response } from "express";
import { setupChannel } from "../utils/setupConnections/setupRabbitMq";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
import { storeOrder } from "../utils/dbOperations/orderOperations";
import { dbFailure, rabbitFailure } from "../utils/constants/failureConstants";
dotenv.config();

const orderQueue = process.env.ORDER_QUEUE!;

export async function placeOrder(req: Request, res: Response){
  
  // order generate kiya
  const orderRequested = req.body;
  const orderId = uuidv4();
  const orderDetails = {orderId: orderId, ...orderRequested, orderStatus: "PENDING"};
  
  // storing in db
  if(!await storeOrder(orderDetails)){
    return res.send(dbFailure.DB_WRITE_FAILURE);
  }

  // sending order to queue
  const channel = await setupChannel();
  if(!channel){
    return res.send(rabbitFailure.RABBIT_CHANNEL_CREATION_FAILURE)
  }
  if(!orderQueue){
    return res.send(rabbitFailure.QUEUE_MISSING);
  }

  await channel.assertQueue(orderQueue,
    { durable:true }
  );
  
  try{
    channel.sendToQueue(
      orderQueue, 
      Buffer.from(JSON.stringify(orderDetails)),
      { persistent: true }
    );
  }
  catch(error){
    console.log(error);
    return res.send(rabbitFailure.RABBIT_SEND_FAILURE);
  }

  return res
    .status(200)
    .json({
      requestStatus: "waiting for payment",
      details: orderDetails
    });
}