import authController from "../controllers/authController.js"
import { requestAccessToken, verifyAdmin } from '../middlewares/JWT.js'
import express from "express";

const router = express.Router();


router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/loginWithGoogle", authController.googleLogin);
router.get("/getAllUsers", verifyAdmin, authController.getAllUsers);
router.post("/refresh", requestAccessToken);

export default router;