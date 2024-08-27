import express from "express";
import { router } from "./routes/router";
//  process.env.PORT |

const PORT = 3000;
const app = express();
app.use(express.json());

const ROUTE = '/orderService/v1';
app.listen(PORT,()=>{
  console.log(`Server is running here: http://localhost:${PORT}${ROUTE}`);
});

app.use(ROUTE, router); 