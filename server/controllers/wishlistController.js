const Wishlist = require("../models/Wishlist");

// ❤️ Add / Remove
exports.toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const exists = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    if (exists) {
      await exists.deleteOne();
      return res.json({ message: "Removed from wishlist" });
    }

    const item = await Wishlist.create({
      user: userId,
      product: productId,
    });

    res.json({ message: "Added to wishlist", item });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id })
      .populate("product");

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};