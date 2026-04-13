require("dotenv").config();


const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const aiRoutes = require("./routes/aiRoutes")

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/ai", aiRoutes);

// database connect
connectDB();

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});