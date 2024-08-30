import { resolve } from "path";
import { dbFailure } from "../constants/failureConstants";
import { dbSuccess } from "../constants/successConstants";
import {connectDB} from "../setupConnections/setupMongoDb";
import { shipments } from "../types";
import { rejects } from "assert";

export async function addShipment(shipmentDetails: shipments){

  const db = await connectDB();

  if(db){
    try{
      const shipmentsCol =  db.collection("shipments");
      shipmentsCol.insertOne(shipmentDetails);
      return new Promise((resolve, reject)=>resolve((dbSuccess.DB_WRITE_SUCCESS)));
    }
    catch(error){
      console.log(error);
    }
  }
  else{
    return new Promise((resolve, reject)=>reject(dbFailure.DB_FAILURE))
  }


  return new Promise ((resolve, reject)=>reject(dbFailure.DB_WRITE_FAILURE));
}

export async function updateShipmentStatusSuccess(shipmentDetails: shipments){
  const db = await connectDB();

  if(db){
    const ordersCol =  db.collection("orders");
    const shipmentsCol =  db.collection("shipments");

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
    return new Promise((resolve, reject)=>resolve(dbSuccess.DB_WRITE_SUCCESS));
  }
  else{
    console.log("Could not write to DB");
  }
  
  return new Promise((resolve, reject)=>reject(dbFailure.DB_WRITE_FAILURE));
}

export async function updateShipmentStatusFailure(shipmentDetails: shipments){
  const db = await connectDB();

  if(db){
    const shipmentsCol =  db.collection("shipments");

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

    return new Promise((resolve, reject)=>resolve(dbSuccess.DB_WRITE_SUCCESS));
  }

  return new Promise((resolve, reject)=>reject(dbFailure.DB_WRITE_FAILURE));
}