import React from "react";
import "./Gamecard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const Gamecard = ({ game }) => {
  const handleAddGame = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/games/add-game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          gameCardId: game._id,
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
        <button className="card-overlay" onClick={handleAddGame}>
          <FontAwesomeIcon icon={faPlusCircle} className="overlay-add-icon" />
        </button>
      </div>
      <h3 className="card-title">{game.name}</h3>
    </div>
  );
};

export default Gamecard;
