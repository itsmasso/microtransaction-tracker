import React, { useEffect } from "react";
import "./Gamecard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Gamecard = ({ user, game, userGame, source, onClick }) => {
  const [gameDetails, setGameDetails] = useState(null);
  const [isDisabled, setIsDisabled] = useState(!!userGame);
  const handleViewGame = async (e) => {
    e.preventDefault();
    if (onClick) {
      console.log("Gamecard clicked:", userGame ?? gameDetails);
      onClick(userGame ?? gameDetails);
    }
  };
  useEffect(() => {
    setIsDisabled(!!userGame);
  }, [userGame]);

  const handleAddGame = async (e) => {
    e.preventDefault();
    console.log("user:", user);
    console.log("game:", game);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/games/add-game`, {
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
        const newUserGame = data;
        setGameDetails(newUserGame);
        setIsDisabled(true);
        if (onClick) onClick(newUserGame);
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
        {game.coverUrl && (
          <img
            src={game.coverUrl}
            alt={game.name}
            className={`card-image ${
              isDisabled && source === "games" ? "card-image-disabled" : ""
            }`}
          />
        )}
        {source === "games" ? (
          <div
            className="card-overlay"
            onClick={!isDisabled ? handleAddGame : undefined}
          >
            <FontAwesomeIcon
              icon={isDisabled ? faCheckCircle : faPlusCircle}
              className="overlay-add-icon"
            />
          </div>
        ) : null}

        {source === "dashboard" && (
          <button className="card-overlay" onClick={handleViewGame}></button>
        )}
      </div>
      <h3 className="card-title">{game.name}</h3>
    </div>
  );
};

export default Gamecard;
