import categoryController from "../controllers/categoryController.js"
import express from "express";

const router = express.Router();


router.post("/create", categoryController.createCategory);
router.put("/edit/:id", categoryController.editCategory);
router.get("/getAll", categoryController.getAllCategories);
router.get("/getAllChild/:id", categoryController.getCategories);
router.delete("/delete/:id", categoryController.deleteCategory);

export default router;