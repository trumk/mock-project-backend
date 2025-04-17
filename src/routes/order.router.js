import orderController from "../controllers/orderController.js"
import express from "express";
import { verifyJWT, verifyAdmin } from '../middlewares/JWT.js'

const router = express.Router();


router.post("/create", verifyJWT, orderController.createOrder);
router.get("/getOrder", verifyJWT, orderController.getOrder);
router.get("/getOrderDetail/:id", orderController.getOrderDetail);
router.get("/getAllOrder", verifyAdmin, orderController.getAllOrder);
router.put("/edit/:id", verifyAdmin, orderController.cancelOrder);

export default router;