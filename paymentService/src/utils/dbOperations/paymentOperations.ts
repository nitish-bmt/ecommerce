import { DB_FAILURE, DB_WRITE_FAILURE } from "../constants/failureConstants";
import { DB_WRITE_SUCCESS } from "../constants/successConstants";
import {connectDB} from "../setupConnections/setupMongoDb";
import { order, paidOrder } from "../types";

export async function placeOrder(paymentDetails: paidOrder){
  const db = await connectDB();

  if(db){
    
    const ordersCol =  db.collection("orders");
    ordersCol.updateOne(
      { 
        orderId: paymentDetails.orderId
      },
      {
        $set: {"orderStatus": "PLACED"}
      },
      // {upsert: true} //not sure if i should do this
    );

    const paymentsCol = db.collection("payments");
    paymentsCol.insertOne(paymentDetails);

    return DB_WRITE_SUCCESS;
  }
  else{
    console.log("Could not write to DB");
    return DB_FAILURE;
  }
  
  return DB_WRITE_FAILURE;
}

export async function rejectOrder(orderDetails: order){
  const db = await connectDB();

  if(db){
    const ordersCol =  db.collection("orders");
    ordersCol.updateOne(
      { 
        orderId: orderDetails.orderId
      },
      {
        $set: {"orderStatus": orderDetails.orderStatus}
      },
    );


    return DB_WRITE_SUCCESS;
  }
  else{
    console.log("Could not write to DB");
    return DB_FAILURE;
  }
  
  return DB_WRITE_FAILURE;
}
