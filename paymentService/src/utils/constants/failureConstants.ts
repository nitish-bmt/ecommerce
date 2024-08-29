export enum dbFailure{
  DB_FAILURE = "COULD NOT CONNECT TO DB",
  DB_WRITE_FAILURE = "COULD NOT WRITE TO DB",
  DB_READ_FAILURE = "COULD NOT READ FROM DB",
  DB_SEARCH_FAILURE = "COULD NOT FIND DB",
  DB_ITEM_NOT_FOUND = "ITEM NOT FOUND IN DB",
}

export enum rabbitFailure{
  RABBIT_FAILURE = "CONSUMER CANCELLED BY SERVER",
  RABBIT_CONSUMER_FAILURE = "CONSUMER CANCELLED BY SERVER",
  QUEUE_EMPTY = "RABBITMQ QUEUE IS EMPTY",
};

export enum paymentFailure{
  PAYMENT_FAILURE = "PAYMENT FAILED",
}

export enum shipmentFailure{
  SHIPMENT_FAILED = "SHIPMENT FAILED",
  SHIPMENT_STATUS_UNKNOWN = "SHIPMENT COULD NOT BE TRACKED",
}