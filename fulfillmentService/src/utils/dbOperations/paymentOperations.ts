import { dbFailure } from "../constants/failureConstants";
import { dbSuccess } from "../constants/successConstants";
import { validOrderStatus } from "../enums";
import {connectDB} from "../setupConnections/setupMongoDb";
import { orders, payments } from "../types";
import dotenv from "dotenv";
import { updateOrderStatus } from "./orderOperations";
dotenv.config();

const paymentsCollection = process.env.PAYMENTS_COLLECTION || "payments";

export async function placeOrder(paymentDetails: payments){
    
  if(!addPayment(paymentDetails)){
    return false;
  }
  if(!updateOrderStatus(paymentDetails.orderId, validOrderStatus.PLACED)){
    return false;
  }

  console.log(dbSuccess.DB_WRITE_SUCCESS);
  return true;
}

export async function addPayment(paymentDetails: payments){

  const db = await connectDB();
  if(!db){
    console.log(dbFailure.DB_FAILURE);
    return false;
  }

  const paymentsCol = db.collection(paymentsCollection);

  try{
    // adding into payments document
    paymentsCol.insertOne(paymentDetails);
  }
  catch(error){
    console.log(dbFailure.DB_WRITE_FAILURE);
    console.log(error);
    return false;
  }

  return true;
}
