import React from "react";
import "./Dashboard.css";
import Gamecard from "../Gamecard/Gamecard";
import { useState } from "react";
import { useEffect } from "react";
import GameDetailPanel from "../GameDetailsPanel/GameDetailsPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Dashboard = ({ user }) => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [query, setQuery] = useState("");
  const handleGameCardClick = (userGame) => {
    setCurrentGame(userGame);
  };

  const totalSpent = games.length
    ? games.reduce((total, game) => {
        const gameTotal = game.expenses.reduce(
          (sum, expense) => sum + Number(expense.purchaseAmount),
          0
        );
        return total + gameTotal;
      }, 0)
    : null;

  const highestSpentGame = games.length
    ? games.reduce((maxGame, currGame) => {
        const currTotal = currGame.expenses.reduce(
          (sum, expense) => sum + Number(expense.purchaseAmount),
          0
        );
        const maxTotal = maxGame.expenses.reduce(
          (sum, expense) => sum + Number(expense.purchaseAmount),
          0
        );
        return currTotal > maxTotal ? currGame : maxGame;
      })
    : null;

  const topGameTotalExpenses = highestSpentGame
    ? highestSpentGame.expenses.reduce(
        (total, expense) => total + Number(expense.purchaseAmount),
        0
      )
    : null;

  const updateGameDetails = (gameId, updates) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game.gameId._id === gameId ? { ...game, ...updates } : game
      )
    );
    //if game details is open, update it
    if (currentGame?.gameId._id === gameId) {
      setCurrentGame((prev) => ({
        ...prev,
        ...updates,
      }));
    }
  };

const updateUserGames = (gameId) => {
  setGames((prevGames) =>
    prevGames.filter((game) => game.gameId._id !== gameId)
  );
};

  useEffect(() => {
    if (!query.trim()) {
      setFilteredGames(games);
      return;
    }

    const filtered = games.filter((g) =>
      g.gameId.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [query, games]);

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
          setFilteredGames(data.games || []);
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
      <div className="dashboard-top">
        <div className="dashboard-total-spent">
          <h1>${totalSpent}</h1>
          <h3>Total spent</h3>
        </div>

        <div className="dashboard-top-game">
          <div className="dashboard-top-game-content">
            {games.length === 0 ? (
              <p>You have no added games.</p>
            ) : (
              <>
                <img
                  src={highestSpentGame.gameId.coverUrl}
                  alt="highest spent game cover"
                />
                <div className="dashboard-top-game-fade-overlay" />
                <div className="dashboard-top-game-content">
                  <div className="dashboard-top-game-total">
                    <h1>${topGameTotalExpenses}</h1>
                    <span>Total spent</span>
                  </div>
                  <div className="dashboard-top-game-title">
                    <h1>{highestSpentGame.gameId.name}</h1>
                    <span>Highest spent game</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="dashboard-total-subs">
          <h1>0</h1>
          <h3>Subscriptions</h3>
        </div>
      </div>
      <div className="dashboard-games">
        <div className="dashboard-card-header">
          <h2>My Games</h2>
          <form className="dashboard-search-container">
            <FontAwesomeIcon icon={faSearch} size="m" className="search-icon" />
            <input
              type="text"
              value={query}
              placeholder="Search for a game..."
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
        <ul className="dashboard-grid">
          {filteredGames.map((userGame) => (
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
      </div>
      {currentGame && (
        <GameDetailPanel
          userGame={currentGame}
          onClose={() => {
            setCurrentGame(null);
          }}
          onGameDetailChange={updateGameDetails}
          onDeleteUserGame={updateUserGames}
        />
      )}
    </div>
  );
};
export default Dashboard;
