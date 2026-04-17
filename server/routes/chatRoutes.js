const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { startConversation, getConversations } = require("../controllers/chatController");
const { getUnreadCount } = require("../controllers/chatController");

router.post("/start", verifyToken, startChat);
router.get("/", verifyToken, getChats);
router.get("/unread", verifyToken, getUnreadCount);

module.exports = router;