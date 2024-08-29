import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const connection = amqplib.connect("amqp://localhost");


export async function setupChannel(){
  return (await connection).createChannel();
}