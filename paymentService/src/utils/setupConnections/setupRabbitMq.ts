import amqplib from "amqplib";

const connection = amqplib.connect("amqp://localhost");

export async function setupChannel(){
  return (await connection).createChannel();
}