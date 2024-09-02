import { setupChannel } from "../utils/setupConnections/setupRabbitMq";
import { rabbitFailure } from "../utils/constants/failureConstants";

import dotenv from "dotenv";
import { shipments } from "../utils/types";
import { notifySuccess } from "../utils/constants/successConstants";
dotenv.config();


const shippedQueue = process.env.SHIPPED_QUEUE!;

export async function notifyUser() {

  const channel = await setupChannel();
  if(!channel){
    return false;
  }
  channel.assertQueue(shippedQueue);

  try{
    await channel.consume(shippedQueue, (msg)=>{

      if(!msg){
        console.log(rabbitFailure.BUFFER_EMPTY);
        return false;
      }
      if(!sendMail(msg.content)){
        channel.ack(msg);
        return false;
      }

      channel.ack(msg);
    }, {noAck: false});
  }
  catch(error){
    console.log(rabbitFailure.RABBIT_CHANNEL_CREATION_FAILURE);
    return false;
  }

  return true;

}

// mock emailer
export async function sendMail( shipmentBuffer: Buffer) {

  if(!shipmentBuffer){
    console.log(rabbitFailure.QUEUE_EMPTY);
    return false;
  }

  // MOCK EMAIL
  const shipmentDetails: shipments = JSON.parse(shipmentBuffer.toString());
  console.log(`Order no: ${shipmentDetails.orderId} for user: ${shipmentDetails.userId} has been shipped with shipment id: ${shipmentDetails.shipmentId}`)
  
  console.log(notifySuccess.NOTIFICATION_SUCCESS);
  return true;
}