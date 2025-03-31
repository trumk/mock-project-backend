import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const hostname = 'localhost'
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server http://${hostname}:${port}/`)
})