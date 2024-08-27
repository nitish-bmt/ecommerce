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
  orderStatus: string;
}