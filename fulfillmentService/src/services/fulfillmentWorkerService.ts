
import { setupChannel } from "../utils/setupConnections/setupRabbitMq";
import { dbFailure, rabbitFailure, shipmentFailure } from "../utils/constants/failureConstants";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
import { payments, shipments } from "../utils/types";
import { Channel } from "amqplib";
import { shipmentSuccess } from "../utils/constants/successConstants";
import { addShipment, updateShipmentStatus } from "../utils/dbOperations/shipmentOperations";
dotenv.config();

import { validShipmentStatus } from "../utils/enums";

const paymentQueue = process.env.PAYMENT_QUEUE || "payments";
const shippedQueue = process.env.SHIPPED_QUEUE || "shipped";

export async function processFulfillment() {

  const channel = await setupChannel();
  if(!channel){
    console.log(rabbitFailure.RABBIT_CHANNEL_CREATION_FAILURE);
    return false;
  }
  channel.assertQueue(paymentQueue);

  // consume the data from "order" queue and
  // add it to mongo db
  // and also add ti in payments queue for fulfillment queue to consume
  try{
    await channel.consume(paymentQueue, (msg)=>{
      if(!msg){
        console.log(rabbitFailure.QUEUE_EMPTY);
        return false;
      }

      // db operation
      try{
        addToFulfilledQueue(channel, msg.content||null);
      }
      catch(error){
        console.log(error);
        return false;
      }
      finally{
        channel.ack(msg);
      }

    }, {noAck: false});
  }
  catch(error){
    console.log(error);
  }
}

export async function addToFulfilledQueue( channel: Channel ,orderBuffer: Buffer|null) {
  
  if(!orderBuffer){
    console.log(rabbitFailure.BUFFER_EMPTY);
    return false;
  }

  // MOCK PAYMENT
  const orderDetails: payments = JSON.parse(orderBuffer.toString());
  const shipmentDetails: shipments = {
    shipmentId: uuidv4(),
    paymentId: orderDetails.paymentId,
    orderId: orderDetails.orderId,
    userId: orderDetails.userId,
    shipmentStatus: validShipmentStatus.PENDING, 
  }
  
  // starting shipment
  if(!await addShipment(shipmentDetails)){
    return false;
  }

  // callback to fire up when shpment is done
  // asynchronous
  // non-blocking
  shipmentSuccessful(shipmentDetails)
    .then(async(isSuccessful)=>{

      if(!isSuccessful){
        shipmentDetails.shipmentStatus = validShipmentStatus.FAILED;
        await updateShipmentStatus(shipmentDetails);
        console.log(shipmentFailure.SHIPMENT_FAILED);
      }
      
      // sending to queue for notification
      channel.assertQueue(shippedQueue);
      
      // agr successful hai to
      shipmentDetails.shipmentStatus = validShipmentStatus.SUCCEEDED;
      // first update in db then add to RabbitMQ queue
      if(!await updateShipmentStatus(shipmentDetails)){
        return false;
      }
      // now adding in queue

      try{
        channel.sendToQueue(shippedQueue, Buffer.from(JSON.stringify(shipmentDetails)))
      }
      catch(error){
        console.log(error);
      }

      console.log(shipmentSuccess.SHIPMENT_SUCCESS, shipmentDetails.orderId);
  
    })
    .catch((error)=>{
      console.log(error);
      return false;
    });

    return true;
}


// mock shipment
async function shipmentSuccessful(shipmentDetails: shipments): Promise<boolean>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve(true);
    }, 14999);
  });
}