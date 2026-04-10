const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  addProduct,
  getAllProducts,
  markAsSold,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  getMyProducts,
} = require("../controllers/productController");

// 🔥 MULTER CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 🔥 ROUTES

// 👉 ADD PRODUCT (UPDATED)
router.post("/add", verifyToken, upload.single("image"), addProduct);

router.get("/all", getAllProducts);
router.get("/my", verifyToken, getMyProducts);
router.put("/sold/:id", verifyToken, markAsSold);
router.get("/:id", getSingleProduct);
router.delete("/:id", verifyToken, deleteProduct);
router.put("/:id", verifyToken, updateProduct);

module.exports = router;