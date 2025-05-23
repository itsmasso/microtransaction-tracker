import React from "react";
import "./Gamecard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const Gamecard = ({ user, game, source }) => {
  const handleViewGame = async (e) => {
    e.preventDefault();
  };
  const handleAddGame = async (e) => {
    e.preventDefault();
    console.log("user:", user);
    console.log("game:", game);

    try {
      const response = await fetch(`http://localhost:5000/games/add-game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          igdbId: game.igdbId,
          gameData: game,
          purchasePlatforms: [],
          purchaseEmail: "",
          receiptEmails: [],
          keywords: [],
          addedAt: Date.now(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Game added!", data);
      } else {
        console.error("Server error:", data.message);
      }
    } catch (err) {
      console.error("Failed to add game!", err);
    }
  };
  return (
    <div className="card-container">
      <div className="card">
        {game.coverUrl && <img src={game.coverUrl} alt={game.name} />}
        {source === "games" && (
          <button className="card-overlay" onClick={handleAddGame}>
            <FontAwesomeIcon icon={faPlusCircle} className="overlay-add-icon" />
          </button>
        )}
        {source === "dashboard" && (
          <button className="card-overlay" onClick={handleViewGame}></button>
        )}
      </div>
      <h3 className="card-title">{game.name}</h3>
    </div>
  );
};

export default Gamecard;
