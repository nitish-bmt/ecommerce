import amqplib from "amqplib";

const connection = amqplib.connect("amqp://localhost");

export async function setupChannel(){
  try {
    
    const channel = (await connection).createChannel();
    return channel;    

  } catch (error) {
    console.log('Err. from setupChannel:', error)
  }
  return null;
}