const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

router.post("/send", verifyToken, sendMessage);
router.get("/:conversationId", verifyToken, getMessages);

module.exports = router;