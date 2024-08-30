import express from "express";
import { router } from "./routes/router";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();
app.use(express.json());

const ROUTE = '/orderService/v1';
app.listen(PORT,()=>{
  console.log(`Server is running here: http://localhost:${PORT}${ROUTE}`);
});

app.use(ROUTE, router); 