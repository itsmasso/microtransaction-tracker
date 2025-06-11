import { React, useState, useEffect } from "react";
import Gamecard from "../Gamecard/Gamecard";
import "./Games.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const Games = ({ user }) => {
  const [games, setGames] = useState([]);
  const [userGames, setUserGames] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/games/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to fetch games.");
      const data = await response.json();
      console.log(data);
      setGames(data);
    } catch (err) {
      console.error("Failed to fetch games!", err);
    } finally {
      setLoading(false);
    }
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
          setUserGames(data.games);
        }
      } catch (err) {
        console.error("Failed to fetch user games!", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserGames();
  }, [games]);
  return (
    <div className="games">
      <div className="page-card-header" style={{ marginBottom: 20 }}>
        <form onSubmit={handleSearch} className="search-container">
          <FontAwesomeIcon icon={faSearch} size="m" className="search-icon" />
          <input
            type="text"
            value={query}
            placeholder="Search for a game..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
      {loading && <p></p>}
      {!loading && games.length === 0 && (
        <p>Search for a game to add to your library.</p>
      )}
      <ul className="grid">
        {games.map((game) => (
          <li key={game.igdbId}>
            <Gamecard
              user={user}
              game={game}
              userGame={userGames.find(
                (ug) => ug.gameId.igdbId === game.igdbId
              )}
              source="games"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Games;
