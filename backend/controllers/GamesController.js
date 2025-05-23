import UserGamesModel from "../models/UserGames.js";
import GamesModel from "../models/Games.js";
export const AddGame = async (req, res) => {
  const {
    igdbId,
    gameData,
    purchasePlatforms,
    purchaseEmail,
    receiptEmails,
    keywords,
  } = req.body;
  const userId = req.user.id;

  try {
    let game = await GamesModel.findOne({ igdbId });

    if (!game) {
      game = await GamesModel.create({
        igdbId,
        name: gameData.name,
        platform: gameData.platforms,
        coverUrl: gameData.coverUrl,
      });
    }
    const existing = await UserGamesModel.findOne({ userId, gameId: game._id });
    if (existing) {
      return res.status(400).json({ message: "Game already added." });
    }

    const newUserGame = await UserGamesModel.create({
      userId,
      gameId: game._id,
      purchasePlatforms,
      purchaseEmail,
      receiptEmails,
      keywords,
    });
    res
      .status(201)
      .json({ message: "Game added to user successfully!", game: newUserGame });
  } catch (err) {
    console.error("Failed to add game.");
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserGames = async (req, res) => {
const userId = req.user.id;
  try {
    const games = await UserGamesModel.find({ userId }).populate("gameId").exec();
    return res.json({ success: true, games });
  } catch (err) {
    console.error("Failed to fetch games.");
    res.status(500).json({ success: false, message: err.message });
  }
};
