import amqplib from "amqplib";

export async function setupChannel(){

  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();

  return channel;
}