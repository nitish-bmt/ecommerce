import { dbFailure } from "../constants/failureConstants";
import { dbSuccess } from "../constants/successConstants";
import { validOrderStatus } from "../enums";
import {connectDB} from "../setupConnections/setupMongoDb";
import { orders, payments } from "../types";

export async function placeOrder(paymentDetails: payments){

  const db = await connectDB();
  if(!db){
    console.log(dbFailure.DB_FAILURE);
    return false;
  }
    
  const ordersCol =  db.collection("orders");
  const paymentsCol = db.collection("payments");

  try{
    // updating order status
    ordersCol.updateOne(
      { 
        orderId: paymentDetails.orderId
      },
      {
        $set: {"orderStatus": validOrderStatus.PLACED}
      },
    );

    // adding into payments document
    paymentsCol.insertOne({
      "paymentId": paymentDetails.paymentId,
      "orderId": paymentDetails.orderId,
      "userId": paymentDetails.userId,
      "paymentStatus": "SUCCEEDED",
      "paymentType": "UPI"
    });
  }
  catch(error){
    console.log(dbFailure.DB_WRITE_FAILURE);
    console.log(error);
    return false;
  }

  console.log(dbSuccess.DB_WRITE_SUCCESS);
  return true;
}

export async function rejectOrder(orderDetails: orders){
  const db = await connectDB();

  if(!db){
    console.log(dbFailure.DB_FAILURE);
    return false;
  }

  try{
    const ordersCol =  db.collection("orders");
    ordersCol.updateOne(
      { 
        orderId: orderDetails.orderId
      },
      {
        $set: {"orderStatus": orderDetails.orderStatus}
      },
    );
  }
  catch(error){
    console.log(dbFailure.DB_WRITE_FAILURE);
    console.log(error);
    return false;
  }
  
  console.log(dbFailure.DB_WRITE_FAILURE);
  return true;
}
