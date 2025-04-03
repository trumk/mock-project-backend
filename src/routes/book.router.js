import bookController from "../controllers/bookController.js"
import express from "express";

const router = express.Router();


router.post("/create", bookController.createBook);
router.put("/edit/:id", bookController.editBook);
router.get("/getBooks", bookController.getBooks);
router.delete("/delete/:id", bookController.deleteBook);

export default router;