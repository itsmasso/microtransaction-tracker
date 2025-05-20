import express from "express";
import GamesModel from "../models/Games.js";

import { fetchIGDBGames } from "../utils/fetchIGDBGames.js";
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

export default router;
