import orderController from "../controllers/orderController.js"
import express from "express";
import { verifyJWT, verifyAdmin } from '../middlewares/JWT.js'

const router = express.Router();


router.post("/create", verifyJWT, orderController.createOrder);
router.get("/getOrder", verifyJWT, orderController.getOrder);
router.get('/getOrderDetail/:id', verifyJWT, orderController.getOrderDetail);
router.post("/requestCancel/:id", verifyJWT, orderController.requestCancelOrder);

router.get("/getAllOrder", verifyAdmin, orderController.getAllOrder);
router.post("/handleCancel/:id", verifyAdmin, orderController.handleCancelRequest);
router.patch("/updateStatus/:id", verifyAdmin, orderController.updateOrderStatus);

export default router;