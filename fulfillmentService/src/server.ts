import express from "express";
import { router } from "./routes/router";

import { configDotenv } from "dotenv";
import { processFulfillment } from "./services/fulfillmentWorkerService";
configDotenv();

const PORT = process.env.PORT || 5003;
const app = express();
app.use(express.json());

const ROUTE = '/fulfillmentService/v1';
app.listen(PORT,()=>{
  console.log(`Server is running here: http://localhost:${PORT}${ROUTE}`);
});

app.use(ROUTE, router); 

processFulfillment();