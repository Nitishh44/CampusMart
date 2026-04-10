const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    const image = req.file ? req.file.filename : "";

    const product = new Product({
      title,
      description,
      price,
      category,
      image, // 🔥 ADD THIS
      seller: req.user.id,
    });

    await product.save();

    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding product" });
  }
};


exports.getAllProducts = async (req, res) => {
  try {

    const products = await Product.find();

    res.status(200).json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.getSingleProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }
    if(String(product.seller) !== String(req.user.id)) {
      return res.status(403).json({
        message: "Not authorized to delete this product",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if(String(product.seller) !== String(req.user.id)){
      return res.status(403).json({
        message: "Not authorized to edit this product",
      });
    }

    const { title, description, price } = req.body;

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.markAsSold = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isSold = true;
    await product.save();

    res.status(200).json({
      message: "Product marked as sold",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};