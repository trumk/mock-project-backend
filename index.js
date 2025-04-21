import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./src/routes/auth.router.js"
import categoryRouter from "./src/routes/category.router.js"
import bookRouter from "./src/routes/book.router.js"
import discountRouter from "./src/routes/discount.router.js"
import userRouter from "./src/routes/user.router.js"
import orderRouter from "./src/routes/order.router.js"
import { register, createCategory, createCategory1, getALl, getByLayer, getAllChild, deleteCategory, createBook, getBooks } from "./public/example.js"

const app = express();

const routesList = {
  auth: [],
  category: [],
  book: [],
  user: [],
  discount: [],
  order: [],
};

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());

function collectRoutes(router, basePath, groupName) {
  router.stack.forEach((layer) => {
    if (layer.route) {
      const path = `${basePath}${layer.route.path}`;
      const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
      methods.forEach(method => {
        const needsAuthorization = layer.route.stack.some(
          middleware => middleware.handle.name === "verifyAdmin"
        );

        const needsAuthorizationUser = layer.route.stack.some(
          middleware => middleware.handle.name === "verifyJWT"
        );

        let example = {};
        if (method === "POST" && path === "/auth/register") {
          example = { request: register };
        } else if (method === "POST" && path === "/auth/login") {
          example = { request: register };
        } else if (method === "POST" && path === "/category/create") {
          example = { request: createCategory, request1: createCategory1 };
        } else if (method === "GET" && path === "/category/getAll") {
          example = { response: getALl };
        } else if (method === "GET" && path === "/category/getByLayer") {
          example = { response: getByLayer, note: "/category/getByLayer?layer=1" };
        } else if (method === "GET" && path === "/category/getAllChild/:id") {
          example = { response: getAllChild, note: "/category/getAllChild/67ed7de1a8df7ca5373c0e88" };
        } else if (method === "PUT" && path === "/category/edit/:id") {
          example = { request: register, note: "/category/edit/67ed7d7260d26963e1b3489f" };
        } else if (method === "DELETE" && path === "/category/delete/:id") {
          example = { response: deleteCategory, note: "/category/delete/67ed7d7260d26963e1b3489f" };
        } else if (method === "POST" && path === "/book/create") {
          example = { request: createBook };
        } else if (method === "GET" && path === "/book/getBooks") {
          example = { response: getBooks };
        } else {
          example = { note: "No example" };
        }
        routesList[groupName].push({ method, path, example, needsAuthorization, needsAuthorizationUser });
      });
    }
  });
}

app.use("/auth", authRouter);
collectRoutes(authRouter, "/auth", "auth");

app.use("/category", categoryRouter);
collectRoutes(categoryRouter, "/category", "category");

app.use("/book", bookRouter);
collectRoutes(bookRouter, "/book", "book");

app.use("/discount", discountRouter);
collectRoutes(discountRouter, "/discount", "discount");

app.use("/user", userRouter);
collectRoutes(userRouter, "/user", "user");

app.use("/order", orderRouter);
collectRoutes(orderRouter, "/order", "order");

app.get("/api-docs", (req, res) => {
  res.json(routesList);
});

app.use(express.static("public"));

const hostname = 'localhost'
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server http://${hostname}:${port}/`)
})