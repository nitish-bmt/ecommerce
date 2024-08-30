export enum validOrderStatus{
  FAILED = "DEAD",
  PENDING = "PENDING",
  PLACED = "PLACED",
  DELIVERED = "DELIVERED",
};

export enum validPaymentStatus{
  FAILED = "FAILED",
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
}

export enum validShipmentStatus{
  FAILED = "FAILED",
  PENDING = "ON THE WAY",
  SUCCEEDED = "DELIVERED",
}