import GameExpenseDetails from "../models/GameExpenseDetails.js";
import GamesModel from "../models/Games.js";
import ExpenseModel from "../models/GameExpenseDetails.js";
import SubscriptionModel from "../models/GameExpenseDetails.js";

//Add a game for the user with no expenses yet
export const AddGame = async (req, res) => {
  const { igdbId, gameData } = req.body;
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
    const existing = await GameExpenseDetails.findOne({
      userId,
      gameId: game._id,
    });
    if (existing) {
      return res.status(400).json({ message: "Game already added." });
    }

    const newGame = await GameExpenseDetails.create({
      userId,
      gameId: game._id,
      expenses: [],
      subscriptions: [],
    });
    res
      .status(201)
      .json({ message: "Game added to user successfully!", game: newGame });
  } catch (err) {
    console.error("Failed to add game.");
    res.status(500).json({ success: false, message: err.message });
  }
};

//Delete user game
export const deleteUserGame = async (req, res) => {
  const { gameId } = req.body;
  const userId = req.user.id;

  try {
    const userGame = await GameExpenseDetails.findOne({ userId, gameId });

    if (!userGame) {
      return res.status(404).json({ message: "Game not found for this user." });
    }

    //Delete associated expenses and subscriptions
    await ExpenseModel.deleteMany({ _id: { $in: userGame.expenses } });
    await SubscriptionModel.deleteMany({ _id: { $in: userGame.subscriptions } });

    //Now delete the GameExpenseDetails document
    await GameExpenseDetails.findByIdAndDelete(userGame._id);

    res.status(200).json({ message: "Game and associated data deleted successfully!" });
  } catch (err) {
    console.error("Failed to delete game:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//update expenses for a user's tracked game
export const updateGameExpenses = async (req, res) => {
  const { gameId, expenses } = req.body;
  const userId = req.user.id;

  try {
    const game = await GameExpenseDetails.findOne({ userId, gameId });

    if (!game) {
      return res.status(404).json({ message: "User game not found." });
    }

    game.expenses.push(...expenses);
    await game.save();

    res.json({ message: "Expenses updated successfully!", game });
  } catch (err) {
    console.error("Failed to update expenses:");
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteGameExpense = async (req, res) => {
  const { gameId, index } = req.params;
  const userId = req.user.id;
  try {
    const game = await GameExpenseDetails.findOne({ userId, gameId });

    if (!game) {
      return res.status(404).json({ message: "Game not found." });
    }

    const parsedIndex = parseInt(index);
    if (
      isNaN(parsedIndex) ||
      parsedIndex < 0 ||
      parsedIndex >= game.expenses.length
    ) {
      return res.status(400).json({ message: "Invalid expense index." });
    }

    game.expenses.splice(parsedIndex, 1);
    await game.save();

    res.json({ success: true, message: "Expense deleted.", game });
  } catch (err) {
    console.error("Failed to delete expense:");
    res.status(500).json({ success: false, message: err.message });
  }
};

//get all user's games
export const getUserGames = async (req, res) => {
  const userId = req.user.id;
  try {
    const games = await GameExpenseDetails.find({ userId })
      .populate("gameId")
      .exec();
    return res.json({ success: true, games });
  } catch (err) {
    console.error("Failed to fetch games.");
    res.status(500).json({ success: false, message: err.message });
  }
};

export const searchUserGame = async (req, res) => {
  const { query } = req.query;
  const userId = req.user.id;
  if (!query) {
    return res
      .status(400)
      .json({ success: false, message: "Missing search query." });
  }
  try {
    const games = await GameExpenseDetails.find({
      userId,
      "gameId.name": { $regex: query, $options: "i" }, //case-insensitive partial match
    });

    res.json({ success: true, games });
  } catch (err) {
    console.error("Failed to search user game.");
    res.status(500).json({ success: false, message: err.message });
  }
};

//update subscriptions for a user's tracked game
export const updateSubscriptions = async (req, res) => {
  const { gameId, subscriptions } = req.body;
  const userId = req.user.id;

  try {
    const game = await GameExpenseDetails.findOne({ userId, gameId });

    if (!game) {
      return res.status(404).json({ message: "User game not found." });
    }

    game.subscriptions.push(...subscriptions);
    await game.save();

    res.json({ message: "Subscriptions updated successfully!", game });
  } catch (err) {
    console.error("Failed to update subscriptions:");
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteSubscription = async (req, res) => {
  const { gameId, index } = req.params;
  const userId = req.user.id;
  try {
    const game = await GameExpenseDetails.findOne({ userId, gameId });

    if (!game) {
      return res.status(404).json({ message: "Game not found." });
    }

    const parsedIndex = parseInt(index);
    if (
      isNaN(parsedIndex) ||
      parsedIndex < 0 ||
      parsedIndex >= game.subscriptions.length
    ) {
      return res.status(400).json({ message: "Invalid subscription index." });
    }

    game.subscriptions.splice(parsedIndex, 1);
    await game.save();

    res.json({ success: true, message: "Subscription deleted.", game });
  } catch (err) {
    console.error("Failed to delete subscription:");
    res.status(500).json({ success: false, message: err.message });
  }
};