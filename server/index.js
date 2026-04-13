import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoutes);

connectDB();

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running 🚀");
});