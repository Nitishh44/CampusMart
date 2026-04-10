const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const { registerUser, loginUser, getProfile } = require("../controllers/authController");


router.get("/profile", verifyToken, getProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;