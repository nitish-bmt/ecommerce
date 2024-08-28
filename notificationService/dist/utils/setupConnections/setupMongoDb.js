"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustermk1.o7phd.mongodb.net/?retryWrites=true&w=majority&appName=clusterMk1`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new mongodb_1.MongoClient(uri, {
                serverApi: {
                    version: mongodb_1.ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            });
            yield client.connect();
            const db = client.db(process.env.DB);
            return db;
        }
        catch (error) {
            console.log("could not establish connection to DB");
        }
        return null;
    });
}
