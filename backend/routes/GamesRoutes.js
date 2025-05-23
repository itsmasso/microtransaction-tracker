import express from "express";

import { fetchIGDBGames } from "../utils/fetchIGDBGames.js";
import { AddGame, getUserGames } from "../controllers/GamesController.js";
import userAuth from "../middleware/userAuth.js"

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    //fetch games
    const games = await fetchIGDBGames(req.query);
    res.json(games);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch games from IGDB!" });
  }
});

router.post("/add-game", userAuth, AddGame);
router.get("/get-user-games", userAuth, getUserGames);

export default router;
