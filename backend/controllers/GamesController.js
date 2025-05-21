import UserGamesModel from "../models/UserGames.js";

export const AddGame = async (req, res) => {
  const { gameCardId, purchasePlatforms, purchaseEmail, receiptEmails, keywords } =
    req.body;
  const userId = req.user.id;

  try {
    const existing = await UserGamesModel.findOne({ userId, gameCardId });
    if (existing) {
      return res.status(400).json({ message: "Game already added." });
    }

    const newUserGame = new UserGamesModel({
      userId,
      gameCardId,
      purchasePlatforms,
      purchaseEmail,
      receiptEmails,
      keywords,
    });
    await newUserGame.save();
    res
      .status(201)
      .json({ message: "Game added to user successfully!", game: newUserGame });
  } catch (err) {
    console.error("Failed to add game.");
    res.status(500).json({ success: false, message: err.message });
  }
};
