import bookController from "../controllers/bookController.js"
import express from "express";
import { verifyAdmin } from '../middlewares/JWT.js'

const router = express.Router();


router.post("/create", verifyAdmin, bookController.createBook);
router.put("/edit/:id", verifyAdmin,  bookController.editBook);
router.get("/getBooks", bookController.getBooks);
router.delete("/delete/:id",verifyAdmin, bookController.deleteBook);

export default router;