import { setupChannel } from "../utils/setupConnections/setupRabbitMq";
import { rabbitFailure } from "../utils/constants/failureConstants";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
import { order, paidOrder } from "../utils/types";
import { Channel } from "amqplib";
import { placeOrder, rejectOrder } from "../utils/dbOperations/paymentOperations";
import { paymentSuccess } from "../utils/constants/successConstants";
dotenv.config();

const orderQueue = process.env.ORDER_QUEUE || "orders";
const paymentQueue = process.env.PAYMENT_QUEUE || "payments";

export async function processPayment() {

  try{

    const channel = await setupChannel();
    channel.assertQueue(orderQueue);
    
    // consume the data from "order" queue and
    // add it to mongo db
    // and also add ti in payments queue for fulfillment queue to consume
    channel.consume(orderQueue, (msg)=>{
      if(msg){
        addToPaymentQueue( channel, msg.content||null);
        channel.ack(msg);
      }
    },{noAck: false});
  }
  catch(error){
    console.error(rabbitFailure.RABBIT_CONSUMER_FAILURE);
    console.log(error);
  }

}

export async function addToPaymentQueue( channel: Channel ,orderBuffer: Buffer|null) {
  
  if(orderBuffer){

    // MOCK PAYMENT
    const orderDetails: order = JSON.parse(orderBuffer.toString());
    if(await paymentSuccessful(orderDetails)){
      orderDetails.orderStatus = "PLACED";

      const paymentDetails: paidOrder = {paymentId: uuidv4(), ...orderDetails};
      // console.log(paymentDetails);

      // updating in db
      await placeOrder(paymentDetails);
      
      // Adding the Data to payments queue
      channel.assertQueue(paymentQueue);
      channel.sendToQueue(paymentQueue, Buffer.from(JSON.stringify(paymentDetails)));

      console.log(paymentSuccess.PAYMENT_SUCCESS, paymentDetails.orderId);
    }
    else{

      orderDetails.orderStatus = "DEAD";
      await rejectOrder(orderDetails);

      console.error(rabbitFailure.PAYMENT_FAILURE, orderDetails.orderId);
    }
  }
  else{
    console.log("ORDER QUEUE EMPTY");
  }
}

// mock payments
function paymentSuccessful(orderDetails: order): Promise<boolean>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve(Math.floor(Math.random()*1000000)%2 == 0)
      // resolve(true);
    }, 4999);
  });
}