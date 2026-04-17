import express from "express";
const router = express.Router();

import verifyToken from "../middleware/authMiddleware.js";
import { startConversation, getConversations, getUnreadCount } from "../controllers/chatController.js";

router.post("/start", verifyToken, startConversation);
router.get("/", verifyToken, getConversations);
router.get("/unread", verifyToken, getUnreadCount);

export default router;