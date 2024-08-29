import { DB_FAILURE, DB_WRITE_FAILURE } from "../constants/failureConstants";
import { DB_WRITE_SUCCESS } from "../constants/successConstants";
import {connectDB} from "../setupConnections/setupMongoDb";
import { shipment } from "../types";

export async function addShipment(shipmentDetails: shipment){
  const db = await connectDB();

  if(db){

    const shipmentsCol =  db.collection("shipments");
    shipmentsCol.insertOne({
      "shipmentId": shipmentDetails.shipmentId,
      "orderId": shipmentDetails.orderId,
      "userId": shipmentDetails.userId,
      "paymentId": shipmentDetails.paymentId,
      "shipmentStatus": shipmentDetails.shipmentStatus
    });

    return DB_WRITE_SUCCESS;
  }
  else{
    console.log("Could not write to DB");
    return DB_FAILURE;
  }
  
  return DB_WRITE_FAILURE;
}

export async function updateShipmentStatusSuccess(shipmentDetails: shipment){
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
          "orderStatus": shipmentDetails.orderStatus
        }
      },
    );
    shipmentsCol.updateOne(
      { 
        shipmentId: shipmentDetails.shipmentId
      },
      {
        $set: {
          "shipmentStatus": shipmentDetails.shipmentStatus,
          "orderStatus": shipmentDetails.orderStatus
        }
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

export async function updateShipmentStatusFailure(shipmentDetails: shipment){
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


    return DB_WRITE_SUCCESS;
  }
  else{
    console.log("Could not write to DB");
    return DB_FAILURE;
  }
  
  return DB_WRITE_FAILURE;
}