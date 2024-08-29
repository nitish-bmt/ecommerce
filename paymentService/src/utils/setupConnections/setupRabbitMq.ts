import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const connection = amqplib.connect(process.env.AMQPLIB_URI||"amqp://localhost");


export async function setupChannel(){
  return (await connection).createChannel();
}