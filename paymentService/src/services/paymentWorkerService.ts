import { setupChannel } from "../utils/setupConnections/setupRabbitMq";
import { paymentFailure, rabbitFailure } from "../utils/constants/failureConstants";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
import { orders, payments } from "../utils/types";
import { Channel } from "amqplib";
import { placeOrder, rejectOrder } from "../utils/dbOperations/paymentOperations";
import { paymentSuccess } from "../utils/constants/successConstants";
import { validOrderStatus, validPaymentStatus } from "../utils/enums";
dotenv.config();

const orderQueue = process.env.ORDER_QUEUE || "orders";
const paymentQueue = process.env.PAYMENT_QUEUE || "payments";

export async function processPayment() {

  const channel = await setupChannel();
  if(!channel){
    return false;
  }

  channel.assertQueue(orderQueue);

  let paymentProcessed = true;
  try{
    // consume the data from "order" queue and
    // add it to mongo db
    // and also add ti in payments queue for fulfillment queue to consume
    channel.consume(orderQueue, async(msg)=>{
      if(!msg){
        console.log(rabbitFailure.QUEUE_EMPTY);
        paymentProcessed = false;
        return;
      }

      if(!await addToPaymentQueue( channel, msg.content)){
        paymentProcessed = false;
        return;
      }
      channel.ack(msg);
      
    },{noAck: false});
  }
  catch(error){
    console.log(rabbitFailure.RABBIT_CONSUMER_FAILURE);
    console.log(error);
    return false;
  }

  if(paymentProcessed){
    console.log(paymentSuccess.PAYMENT_SUCCESS);
  }
  return paymentProcessed;
}

export async function addToPaymentQueue( channel: Channel ,orderBuffer: Buffer|null) {
  
  if(!orderBuffer){
    console.log(rabbitFailure.QUEUE_EMPTY);
    return false;
  }

  // MOCK PAYMENT
  const orderDetails: orders = JSON.parse(orderBuffer.toString());
  if(! await paymentSuccessful(orderDetails)){

    orderDetails.orderStatus = validOrderStatus.FAILED;
    await rejectOrder(orderDetails)
    console.error(paymentFailure.PAYMENT_FAILURE, orderDetails.orderId);
    return false;
  }

  // baaki code would work if payment is successful
  orderDetails.orderStatus = validOrderStatus.PLACED;
  const paymentDetails: payments = {
    paymentId: uuidv4(),
    orderId: orderDetails.orderId,
    userId: orderDetails.userId,
    paymentStatus: validPaymentStatus.SUCCEEDED,
  };

  // updating in db
  if(!await placeOrder(paymentDetails)){
    return false;
  }      

  // Adding the Data to payments queue
  channel.assertQueue(paymentQueue);
  try{
    channel.sendToQueue(paymentQueue, Buffer.from(JSON.stringify(paymentDetails)));
  }
  catch(error){
    console.log(rabbitFailure.RABBIT_SEND_FAILURE);
    console.log(error);
    return false;
  }

  console.log(paymentSuccess.PAYMENT_SUCCESS, paymentDetails.orderId);
  return true;
}

// mock payments
function paymentSuccessful(orderDetails: orders): Promise<boolean>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve(Math.floor(Math.random()*1000000)%2 == 0)
      // resolve(true);
    }, 4999);
  });
}