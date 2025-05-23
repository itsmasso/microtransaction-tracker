import React from "react";
import "./Dashboard.css";
import Gamecard from "../Gamecard/Gamecard";
import { useState } from "react";
import { useEffect } from "react";

const Dashboard = ({user}) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

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
        {games.map((game) => (
          <li key={game.gameId._id}>
            <Gamecard user={user} game={game.gameId} source="dashboard"/>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Dashboard;
