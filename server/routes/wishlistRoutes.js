const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const {
  toggleWishlist,
  getWishlist,
} = require("../controllers/wishlistController");

router.post("/toggle", verifyToken, toggleWishlist);
router.get("/", verifyToken, getWishlist);

module.exports = router;