import amqplib from "amqplib";
import dotenv from "dotenv";
import { rabbitFailure } from "../constants/failureConstants";
dotenv.config();

export async function setupChannel(){

  const uri = process.env.AMQLIB_URI;

  try{
    if(uri != undefined){
      const connection = await amqplib.connect(uri);
    
      try{
        const channel = await connection.createChannel();
        return channel;
      }
      catch(error){
        console.error(rabbitFailure.RABBIT_CHANNEL_CREATION_FAILURE);
        console.log(error);
      }
    }
    else{
      console.log(rabbitFailure.RABBIT_URL_EMPTY)
      throw new Error();
    }
  }
  catch(error){
    console.error(rabbitFailure.RABBIT_FAILURE);
    console.log(error);
  }

  return null;
}