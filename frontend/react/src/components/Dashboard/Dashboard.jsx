import React from "react";
import "./Dashboard.css";
import Gamecard from "../Gamecard/Gamecard";
import { useState } from "react";
import { useEffect } from "react";
import GameDetailPanel from "../GameDetailsPanel/GameDetailsPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import spinner from "../../assets/spinner.svg";
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

  const totalSubs = games.length
    ? games.reduce((total, game) => {
        const subCount = game.subscriptions.length;
        return total + subCount;
      }, 0)
    : null;

  const totalSpent = games.length
    ? games.reduce((total, game) => {
        const expenseTotal = game.expenses.reduce(
          (sum, expense) => sum + Number(expense.purchaseAmount),
          0
        );
        const subsTotal = game.subscriptions.reduce(
          (sum, sub) => sum + Number(sub.purchaseAmount),
          0
        );
        return total + expenseTotal + subsTotal;
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
          `${import.meta.env.VITE_API_URL}/games/get-user-games`,
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
      {loading && <img src={spinner} alt="loading image" className="spinner" />}
      {!loading && (
        <div className="dashboard-top-cards">
          <div className="page-card dashboard-total-spent">
            <h1>${totalSpent ?? 0}</h1>
            <h3>Total spent</h3>
          </div>

          {games.length === 0 ? (
            <div className="page-card dashboard-top-game hide-on-mobile">
              <p>Add a game to show your most spent game!</p>
            </div>
          ) : (
            <div className="image-overlay-card dashboard-top-game hide-on-mobile">
              <img
                src={highestSpentGame.gameId.coverUrl}
                alt="Top game cover"
              />
              <div className="image-overlay-bg-fade" />
              <div className="image-overlay-card-content top-game-content">
                <div className="dashboard-top-game-total">
                  <h1>${topGameTotalExpenses}</h1>
                  <span>Total spent</span>
                </div>
                <div className="dashboard-top-game-title">
                  <h1>{highestSpentGame.gameId.name}</h1>
                  <span>Highest spent game</span>
                </div>
              </div>
            </div>
          )}

          <div className="page-card dashboard-total-subs">
            <h1>{totalSubs ?? 0}</h1>
            <h3>Subscriptions</h3>
          </div>
        </div>
      )}
      {!loading && (
        <div className="page-card dashboard-games">
          <div className="page-card-header">
            <h2>My Games</h2>
            <form className="dashboard-search-container">
              <FontAwesomeIcon
                icon={faSearch}
                size="m"
                className="search-icon"
              />
              <input
                type="text"
                value={query}
                placeholder="Search for a game..."
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
          </div>
          {filteredGames.length === 0 ? (
            <p>No added games yet.</p>
          ) : (
            <ul className="grid">
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
          )}
        </div>
      )}
      {!loading && currentGame && (
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
