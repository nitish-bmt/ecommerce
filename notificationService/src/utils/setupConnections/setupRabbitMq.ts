import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();
// import { addToPaymentQueue } from "../../controllers/fulfillmentController";
const orderQueue = process.env.ORDER_QUEUE||"orders";
const connection = amqplib.connect("amqp://localhost");


export async function setupChannel(){
  const conn = await connection;

  return (await connection).createChannel();
}