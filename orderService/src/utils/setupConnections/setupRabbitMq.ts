import amqplib from "amqplib";
import dotenv from "dotenv";
import { rabbitFailure } from "../constants/failureConstants";
dotenv.config();

export async function setupChannel() {

  const uri = process.env.AMQPLIB_URI;

  if (uri === undefined) {
    console.log(rabbitFailure.RABBIT_URL_EMPTY);
    return;
  }

  // creating connection
  // with graceful error handling
  let connection = null;
  try {
    connection = await amqplib.connect(uri);
  }
  catch (error) {
    console.log(error);
    console.log(rabbitFailure.RABBIT_FAILURE);
    return;
  }

  // channel
  let channel = null;
  try {
    channel = await connection.createChannel();
  }
  catch (error) {
    console.log(error);
    console.log(rabbitFailure.RABBIT_CHANNEL_CREATION_FAILURE);
  }

  return channel;
}