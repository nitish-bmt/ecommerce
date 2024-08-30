import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from "dotenv";
import { dbFailure } from '../constants/failureConstants';
dotenv.config();

const uri = process.env.DB_STRING;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export async function connectDB(){
  if(uri){
    try{
      const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      await client.connect();

      return client.db(process.env.DB);
    }
    catch(error){
      console.error(dbFailure.DB_FAILURE);
      console.log(error)
    }
  }
  else{
    console.error(dbFailure.EMPTY_DB_STRING);
  }

  return null;
}