import { dbFailure } from "../constants/failureConstants";
import { dbSuccess } from "../constants/successConstants";
import {connectDB} from "../setupConnections/setupMongoDb";
import { shipments } from "../types";
import { validOrderStatus} from "../enums";


export async function addShipment(shipmentDetails: shipments){

  const db = await connectDB();

  if(!db){
    console.log(dbFailure.DB_FAILURE);
    return false;
  }

  try{
    const shipmentsCol =  db.collection("shipments");
    shipmentsCol.insertOne(shipmentDetails);
    console.log(dbSuccess.DB_WRITE_SUCCESS);
  }
  catch(error){
    console.log(error);
    console.log(dbFailure.DB_WRITE_FAILURE);
    return false;
  }

  console.log(dbSuccess.DB_WRITE_SUCCESS);
  return true;
}

export async function updateShipmentStatusSuccess(shipmentDetails: shipments){
  const db = await connectDB();

  if(!db){
    console.log(dbFailure.DB_FAILURE);
    return false;
  }

  const ordersCol =  db.collection("orders");
  const shipmentsCol =  db.collection("shipments");
  
  // writing to db
  // error handling
  try{
    ordersCol.updateOne(
      { 
        orderId: shipmentDetails.orderId
      },
      {
        $set: {
          "orderStatus": validOrderStatus.DELIVERED
        }
      },
    );
    shipmentsCol.updateOne(
      { 
        shipmentId: shipmentDetails.orderId
      },
      {
        $set: {
          "shipmentStatus": shipmentDetails.shipmentStatus,
        }
      },
    );
    console.log(dbSuccess.DB_WRITE_SUCCESS);
  }
  catch(error){
    console.log(error)
    console.log(dbFailure.DB_WRITE_FAILURE);
    return false;
  }

  console.log(dbSuccess.DB_WRITE_SUCCESS);
  return true;
}

export async function updateShipmentStatusFailure(shipmentDetails: shipments){
  const db = await connectDB();

  if(!db){
    console.log(dbFailure.DB_FAILURE);
    return false;
  }

  const shipmentsCol =  db.collection("shipments");

  try{
    shipmentsCol.updateOne(
      { 
        shipmentId: shipmentDetails.shipmentId
      },
      {
        $set: {
          "shipmentStatus": shipmentDetails.shipmentStatus,
        }
      },
    );
  }
  catch(error){
    console.error(dbFailure.DB_WRITE_FAILURE)
    console.log(error);
    return false;
  }

  console.log(dbSuccess.DB_WRITE_SUCCESS);
  return true;
}