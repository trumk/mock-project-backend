import userController from "../controllers/userController.js"
import express from "express";
import { verifyJWT } from '../middlewares/JWT.js'

const router = express.Router();

router.use(verifyJWT)

router.put("/edit/:id", userController.editProfile);
router.get("/:id", userController.getProfile);


export default router;