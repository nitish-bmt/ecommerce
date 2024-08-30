import express from "express";
import { router } from "./routes/router";

import { configDotenv } from "dotenv";
import { processPayment } from "./services/paymentWorkerService";
configDotenv();

const PORT = process.env.PORT || 5002;
const app = express();
app.use(express.json());

const ROUTE = '/paymentService/v1';
app.listen(PORT,()=>{
  console.log(`Server is running here: http://localhost:${PORT}${ROUTE}`);
});

app.use(ROUTE, router); 

processPayment();