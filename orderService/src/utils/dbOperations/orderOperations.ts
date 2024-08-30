import { dbFailure } from "../constants/failureConstants";
import { dbSuccess } from "../constants/successConstants";
import { connectDB } from "../setupConnections/setupMongoDb";
import { order } from "../types";

export async function storeOrder(orderDetails: order){
  
  const db = await connectDB();
  if(!db){
    console.log(dbFailure.DB_FAILURE);
    return false;
  }

  const ordersCol =  db.collection("orders");
  try{
    ordersCol.insertOne(orderDetails);
    console.log(dbSuccess.DB_WRITE_SUCCESS);
  }
  catch(error){
    console.log(dbFailure.DB_WRITE_FAILURE);
    console.log(error);
    return false;
  }

  return true;
}