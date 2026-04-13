
export const generateDescription = async (req, res) => {
  try {
    const { title } = req.body;

    const descriptions = [
      `${title} with high performance and sleek design. Perfect for daily use.`,
      `Premium ${title} offering great value and durability.`,
      `${title} - reliable, efficient, and best in class.`,
      `Experience top quality with this amazing ${title}.`,
    ];

    const random =
      descriptions[Math.floor(Math.random() * descriptions.length)];

    res.json({ description: random });

  } catch (err) {
    res.status(500).json({ message: "AI error" });
  }
};