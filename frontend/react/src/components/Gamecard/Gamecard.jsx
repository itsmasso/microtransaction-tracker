import React from "react";
import "./Gamecard.css";
const Gamecard = ({ game }) => {
  return (
    <div className="card-container">
      <div className="card">
        {game.coverUrl && <img src={game.coverUrl} alt={game.name} />}
      </div>
      <h3 className="card-title">{game.name}</h3>
    </div>
  );
};

export default Gamecard;
