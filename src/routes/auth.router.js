import authController from "../controllers/authController.js"
import { requestAccessToken } from '../middlewares/JWT.js'
import express from "express";

const router = express.Router();


router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/loginWithGoogle", authController.googleLogin);
router.post("/refresh", requestAccessToken);

export default router;