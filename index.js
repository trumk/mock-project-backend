import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./src/routes/auth.router.js"
import categoryRouter from "./src/routes/category.router.js"

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authRouter);
app.use("/category", categoryRouter);

const hostname = 'localhost'
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server http://${hostname}:${port}/`)
})