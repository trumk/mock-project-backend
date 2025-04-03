import categoryController from "../controllers/categoryController.js"
import express from "express";
import { verifyAdmin } from '../middlewares/JWT.js'

const router = express.Router();


router.post("/create", verifyAdmin, categoryController.createCategory);
router.put("/edit/:id", verifyAdmin, categoryController.editCategory);
router.get("/getAll", categoryController.getAllCategories);
router.get("/getByLayer", categoryController.getCategoriesByLayer);
router.get("/getAllChild/:id", categoryController.getCategories);
router.delete("/delete/:id", verifyAdmin, categoryController.deleteCategory);

export default router;