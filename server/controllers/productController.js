import Product from "../models/Product.js";

// ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? req.file.filename : "";

    const product = new Product({
      title,
      description,
      price,
      category,
      image,
      seller: req.user.id,
    });

    await product.save();

    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding product" });
  }
};

// GET ALL
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SINGLE
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (String(product.seller) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (String(product.seller) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, price } = req.body;

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;

    await product.save();

    res.status(200).json({ message: "Updated", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MY PRODUCTS
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SOLD
export const markAsSold = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isSold = true;
    await product.save();

    res.status(200).json({ message: "Marked as sold", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};