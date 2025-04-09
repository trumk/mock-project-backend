import discountController from "../controllers/discountController.js"
import express from "express";
import { verifyAdmin } from '../middlewares/JWT.js'

const router = express.Router();

router.post("/create", verifyAdmin, discountController.createDiscount);
router.put("/edit/:id", verifyAdmin, discountController.editDiscount);
router.get("/getAll", discountController.getAllDiscount);
router.post("/apply", discountController.applyDiscountPreview);
router.delete("/delete/:id", verifyAdmin, discountController.deleteDiscount);

export default router;