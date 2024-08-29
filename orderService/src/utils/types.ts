export interface users{
  userId: string;
  username: string;
  email: string;
  contact: string;
  pass: string;
}

export interface products{
  productId: string;
  productTitle: string;
  productDesc: string;
  productPrice: number;
}

export interface orderRequest{
  userId: string;
  orderItems: [
    {
      productId: string;
      productQty: number; 
      productPrice: number;
    },
  ];
}

export interface order extends orderRequest{
  orderId: string;
  orderStatus: validOrderStatus;
}

export interface payments{
  paymentId: string;
  orderId: string;
  userId: string;
  paymentStatus: validPaymentStatus;
}

export interface shipments extends Omit<payments, "paymentStatus">{
  shipmentId: string;
  shipmentStatus: validShipmentStatus;
}