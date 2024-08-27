import { DB_FAILURE, DB_WRITE_FAILURE } from "../constants/failureConstants";
import { DB_WRITE_SUCCESS } from "../constants/successConstants";
import {connectDB} from "../setupConnections/setupMongoDb";
import { order } from "../types";

export async function updateOrder(orderDetails: order){
  const db = await connectDB();

  if(db){
    const ordersCol =  db.collection("orders");
    const p = ordersCol.insertOne(orderDetails);
    return DB_WRITE_SUCCESS;
  }
  else{
    console.log("Could not write to DB");
    return DB_FAILURE;
  }
  
  return DB_WRITE_FAILURE;
}