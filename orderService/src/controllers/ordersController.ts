import { Request, Response } from "express";
import { setupChannel } from "../utils/setupConnections/setupRabbitMq";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
import { storeOrder } from "../utils/dbOperations/orderOperations";
dotenv.config();

const orderQueue = process.env.ORDER_QUEUE||"orders";

export async function placeOrder(req: Request, res: Response){
  
  // order generate kiya
  const orderRequested = req.body;
  // console.log(orderRequested);
  const orderId = uuidv4();
  const orderDetails = {orderId: orderId, ...orderRequested, orderStatus: "PENDING"};
  // console.log(orderDetails);
  
  // order sent to queue
  // Buffer me conversion not needed
  const channel = await setupChannel();
  if(!channel){
    return res.send('Channel not setup')
  }else{
    await channel.assertQueue(orderQueue,{
      // read about this
      durable:true
    });
    
    channel.sendToQueue(orderQueue, Buffer.from(JSON.stringify(orderDetails)),{
                                                                                persistent: true 
                                                                              });
  
    // storing in db
    await storeOrder(orderDetails);
    
    res
      .status(200)
      .json({
        requestStatus: "waiting for payment",
        details: orderDetails
      })}
}