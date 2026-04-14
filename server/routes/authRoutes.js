import express from "express";
import verifyToken from "../middleware/authMiddleware";

import { registerUser, loginUser, getProfile } from "../controllers/authController.js";

const router = express.Router();


router.get("/profile", verifyToken, getProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;