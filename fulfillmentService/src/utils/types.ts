export interface orderRequest{
  userId: string;
  orderItems: [
    {
      productId: string;
      productQty: number; 
    },
  ];
}

export interface order extends orderRequest{
  orderId: string;
  orderStatus: "DEAD"|"PENDING"|"PLACED"|"DELIVERED";
}

export interface paidOrder extends order{
  paymentId: string;
}

export interface shipment extends paidOrder{
  shipmentId: string;
  shipmentStatus: "DEAD"|"ON THE WAY"|"SHIPPED";
}