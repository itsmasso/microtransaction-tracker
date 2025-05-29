import express from "express";

import { fetchIGDBGames } from "../utils/fetchIGDBGames.js";
import { AddGame, getUserGames, updateGameExpenses, deleteGameExpense } from "../controllers/GamesController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

//Search IGDB games
router.get("/search", async (req, res) => {
  try {
    const games = await fetchIGDBGames(req.query);
    res.json(games);
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch games from IGDB!" });
  }
});

//Add a new game to user's tracked list
router.post("/add-game", userAuth, AddGame);

//Get all games for the authenticated user
router.get("/get-user-games", userAuth, getUserGames);

//Update/add expenses to a tracked game
router.put("/update-game-expense", userAuth, updateGameExpenses);

//delete expense to a tracked game
router.delete("/delete-game-expense/:gameId/:index", userAuth, deleteGameExpense)

export default router;

