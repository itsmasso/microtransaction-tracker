import React from "react";
import "./Dashboard.css";
import Gamecard from "../Gamecard/Gamecard";
import { useState } from "react";
import { useEffect } from "react";
import GameDetailPanel from "../GameDetailsPanel/GameDetailsPanel";

const Dashboard = ({ user }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const handleGameCardClick = (userGame) => {
    setCurrentGame(userGame);
  };
  useEffect(() => {
    const fetchUserGames = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/games/get-user-games`,
          { method: "GET", credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setGames(data.games || []);
        }
      } catch (err) {
        console.error("Failed to fetch user games!", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserGames();
  }, []);

  return (
    <div className="dashboard">
      {loading && <p>Loading...</p>}
      <ul className="dashboards-grid">
        {games.map((userGame) => (
          <li key={userGame.gameId._id}>
            <Gamecard
              user={user}
              game={userGame.gameId}
              userGame={userGame}
              source="dashboard"
              onClick={() => handleGameCardClick(userGame)}
            />
          </li>
        ))}
      </ul>
      {currentGame && (
        <GameDetailPanel
          userGame={currentGame}
          onClose={() => {
            setCurrentGame(null);
          }}
        />
      )}
    </div>
  );
};
export default Dashboard;
