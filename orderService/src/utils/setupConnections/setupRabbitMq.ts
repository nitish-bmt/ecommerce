import amqplib from "amqplib";

export async function setupChannel(){
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
  
    return channel;    
  } catch (error) {
    console.log('Err. from setupChannel:', error)
  }
  return null;
}