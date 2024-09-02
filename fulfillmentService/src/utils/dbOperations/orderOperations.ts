import { dbFailure } from "../constants/failureConstants";
import { dbSuccess } from "../constants/successConstants";
import { validOrderStatus } from "../enums";
import {connectDB} from "../setupConnections/setupMongoDb";
const ordersCollection = process.env.ORDERS_COLLECTION || "orders";

export async function updateOrderStatus(orderId: string, orderStatus: validOrderStatus){
  const db = await connectDB();

  if(!db){
    console.log(dbFailure.DB_FAILURE);
    return false;
  }

  try{
    const ordersCol =  db.collection(ordersCollection);
    ordersCol.updateOne(
      { 
        orderId: orderId
      },
      {
        $set: {"orderStatus": orderStatus}
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