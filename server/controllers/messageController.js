const Message = require("../models/Message");

// Send new message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const message = await Message.create({
      conversationId,
      sender: req.user.id,
      text,
      isRead: false
    });

    res.status(201).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Get all messages of one conversation
exports.getMessages = async (req, res) => {
  try {
    await Message.updateMany(
      {
        conversationId: req.params.id,
        sender: { $ne: req.user.id },
        isRead: false,
      },
      { $set: { isRead: true }}
    )
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};