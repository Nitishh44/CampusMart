const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { startConversation, getConversations } = require("../controllers/chatController");
const { getUnreadCount } = require("../controllers/chatController");

router.post("/start", verifyToken, startConversation);
router.get("/", verifyToken, getConversations);
router.get("/unread", verifyToken, getUnreadCount);

module.exports = router;