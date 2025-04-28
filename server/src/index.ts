import dotenv from "dotenv";
dotenv.config();

import  express, {Express} from "express";
import mongoose from "mongoose";

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const mongoURI: string = process.env.MONGODB_URI || "";

// now connect mangooose if not connect then throw erro for that use catch
mongoose
    .connect(mongoURI)
    .then(()=> console.log("CONNECTED TO MONGODB!"))
    .catch((err) => console.error("Failed to connect to mongoDB:",err));
