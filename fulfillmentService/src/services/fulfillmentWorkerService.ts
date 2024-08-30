
import { setupChannel } from "../utils/setupConnections/setupRabbitMq";
import { dbFailure, rabbitFailure, shipmentFailure } from "../utils/constants/failureConstants";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
import { payments, shipments } from "../utils/types";
import { Channel } from "amqplib";
import { shipmentSuccess } from "../utils/constants/successConstants";
import { addShipment, updateShipmentStatusFailure, updateShipmentStatusSuccess } from "../utils/dbOperations/shipmentOperations";
dotenv.config();

const paymentQueue = process.env.PAYMENT_QUEUE || "payments";
const shippedQueue = process.env.SHIPPED_QUEUE || "shipped";

export async function processFulfillment() {

  try{

    const channel = await setupChannel();
    if(!channel){
      throw new Error();
    }
    channel.assertQueue(paymentQueue);
    
    // consume the data from "order" queue and
    // add it to mongo db
    // and also add ti in payments queue for fulfillment queue to consume
    await channel.consume(paymentQueue, (msg)=>{
      if(msg){
        addToFulfilledQueue(channel, msg.content||null);
        channel.ack(msg);
      }
    }, {noAck: false});
  }
  catch(error){
    console.error(rabbitFailure.RABBIT_CONSUMER_FAILURE);
    console.log(error);
  }
}

export async function addToFulfilledQueue( channel: Channel ,orderBuffer: Buffer|null) {
  
  if(orderBuffer){

    // MOCK PAYMENT
    const orderDetails: payments = JSON.parse(orderBuffer.toString());
    const shipmentDetails: shipments = {shipmentId: uuidv4(), shipmentStatus: validShipmentStatus.PENDING, ...orderDetails}
    
    try{
      addShipment(shipmentDetails);
    }
    catch(error){
      console.log(error);
    }

    shipmentSuccessful(shipmentDetails)
      .then((isSuccessful)=>{
        if(isSuccessful){
          shipmentDetails.shipmentStatus = validShipmentStatus.SUCCEEDED;
          console.log(shipmentSuccess.SHIPMENT_SUCCESS, shipmentDetails.orderId);

          // sending to queue for notification
          channel.assertQueue(shippedQueue);

          // first update in db then add to RabbitMQ queue
          updateShipmentStatusSuccess(shipmentDetails)
            .then((status) => {
              // try catch for rabbitmq
              try{
                channel.sendToQueue(shippedQueue, Buffer.from(JSON.stringify(shipmentDetails)))
              }
              catch(error){
                console.error(rabbitFailure.RABBIT_SEND_FAILURE);
                console.log(error);
              }
            })
            .catch((error)=>{ //catching reject from db operation
              console.log(error);
            });
        }
        else{
          shipmentDetails.shipmentStatus = validShipmentStatus.FAILED;
          console.error(shipmentFailure.SHIPMENT_FAILED, shipmentDetails.orderId);
          updateShipmentStatusFailure(shipmentDetails);
        }
      })
      .catch((error)=>{
        shipmentDetails.shipmentStatus = validShipmentStatus.PENDING;
        console.error(shipmentFailure.SHIPMENT_STATUS_UNKNOWN, shipmentDetails.orderId);
        updateShipmentStatusFailure(shipmentDetails);
        console.log(error);
      })
  }
  else{
    console.log(rabbitFailure.QUEUE_EMPTY);
  }

}

// mock shipment
async function shipmentSuccessful(shipmentDetails: shipments): Promise<boolean>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve(true);
    }, 14999);
  });
}