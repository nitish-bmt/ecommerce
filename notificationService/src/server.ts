import express from "express";
import { router } from "./routes/router";

import { configDotenv } from "dotenv";
import { notifyUser } from "./controllers/notificationController";
configDotenv();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const ROUTE = '/notificationService/v1';
app.listen(PORT,()=>{
  console.log(`Server is running here: http://localhost:${PORT}${ROUTE}`);
});

app.use(ROUTE, router); 

notifyUser();