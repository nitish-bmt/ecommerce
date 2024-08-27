import { Request, Response } from "express";
import { setupChannel } from "../utils/setupConnections/setupRabbitMq";
import { RABBIT_CONSUMER_FAILURE, RABBIT_FAILURE } from "../utils/constants/failureConstants";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
import { order } from "../utils/types";
dotenv.config();

const orderQueue = process.env.ORDER_QUEUE || "orders";
const paymentQueue = process.env.PAYMENT_QUEUE || "payments";

export async function processPayment(req: Request, res: Response){

  const orderDetails = await getOrder();

  if(orderDetails != null){

    res
      .status(200)
      .json(orderDetails);
    return;
  }
  else{
    res
      .status(200)
      .send("empty queue");
    return;
  }
}

async function getOrder(){
  try{
    const channel = await setupChannel();

    channel.assertQueue(orderQueue);
    await channel.consume(orderQueue, (msg)=>{

      if( msg!==null ){
        console.log("hellll: ", msg.content.toString());

        addToPaymentQueue(msg.content);

        return (msg.content.toString());
        
      }
      else{
        console.log(RABBIT_CONSUMER_FAILURE);
      }
    }, {
      // acknowledment ke bina delete kr dega
      noAck: true
    });
  }
  catch(err){
    console.log(RABBIT_FAILURE);
  }
  // finally{
  //   conn
  // }

  return null;
}

async function addToPaymentQueue(orderDetails: Buffer){

  console.log(orderDetails);
  
  try{
    const channel = await setupChannel();

    channel.assertQueue(paymentQueue);
    channel.sendToQueue(paymentQueue, orderDetails);

  }
  catch(err){
    console.log(RABBIT_FAILURE);
  }

  return null;
}