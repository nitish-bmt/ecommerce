import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from "dotenv";
dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustermk1.o7phd.mongodb.net/?retryWrites=true&w=majority&appName=clusterMk1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export async function connectDB(){
  try{
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();

    const db = client.db(process.env.DB);
    return db;
  }
  catch(error){
    console.log("could not establish connection to DB");
  }

  return null;
}