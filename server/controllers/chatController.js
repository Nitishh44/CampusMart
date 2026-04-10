const Conversation = require("../models/Conversation");
const Message = require("../models/Message")

// Create or get existing conversation
exports.startConversation = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { sellerId, productId } = req.body;

    // Buyer खुद seller से chat नहीं कर सकता
    if (buyerId === sellerId) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    // Check existing conversation
    let conversation = await Conversation.findOne({
      buyer: buyerId,
      seller: sellerId,
      product: productId,
    });

    // If not found, create new one
    if (!conversation) {
      conversation = await Conversation.create({
        buyer: buyerId,
        seller: sellerId,
        product: productId,
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error starting conversation" });
  }
};

// Get all conversations of logged-in user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
  $or: [{ buyer: userId }, { seller: userId }],
})
  .populate("product", "title image")
  .populate("buyer", "name")
  .populate("seller", "name")
  .sort({ updatedAt: -1 });

const conversationsWithLastMessage = await Promise.all(
  conversations.map(async (c) => {
    const lastMessage = await Message.findOne({
      conversation: c._id,
    }).sort({ createdAt: -1 });

    return {
      ...c.toObject(),
      lastMessage,
    };
  })
);

res.status(200).json(conversationsWithLastMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching conversations" });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      $or: [{ buyer: userId }, { seller: userId }],
    });

    const ids = conversations.map((c) => c._id);

    const count = await Message.countDocuments({
      conversationId: { $in: ids },
      sender: { $ne: userId },
      isRead: false,
    });

    res.json({ count });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};