import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  isSold : {
    type: Boolean,
    default: false
  },

  category: {
  type: String,
  default: "Others",
 },

  image: {
    type: String,
    default: ""
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("Product", productSchema);