import multer from "multer";
import path from "path";
import express from "express";

import verifyToken from "../middleware/authMiddleware.js";
import {
  addProduct,
  getAllProducts,
  markAsSold,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  getMyProducts,
} from "../controllers/productController.js";

const router = express.Router();

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ROUTES
router.post("/add", verifyToken, upload.single("image"), addProduct);
router.get("/all", getAllProducts);
router.get("/my", verifyToken, getMyProducts);
router.put("/sold/:id", verifyToken, markAsSold);
router.get("/:id", getSingleProduct);
router.delete("/:id", verifyToken, deleteProduct);
router.put("/:id", verifyToken, updateProduct);

export default router;