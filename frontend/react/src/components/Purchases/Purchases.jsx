import { React, useState, useEffect } from "react";
import "./Purchases.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const Purchases = ({ user }) => {
  const [userGames, setUserGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [query, setQuery] = useState("");
  const [usingFilters, setUsingFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };
  const sortedByNewest = filteredGames
    .flatMap((game) => {
      const expenseItems =
        game.expenses?.map((expense) => ({
          ...expense,
          type: "Expense",
          gameName: game.gameId.name,
          gameCoverUrl: game.gameId.coverUrl,
        })) || [];

      const subscriptionItems =
        game.subscriptions?.map((sub) => ({
          ...sub,
          type: "Subscription",
          gameName: game.gameId.name,
          gameCoverUrl: game.gameId.coverUrl,
        })) || [];

      return [...expenseItems, ...subscriptionItems];
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

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
          setUserGames(data.games || []);
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

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = userGames.filter((game) => {
      return game.gameId.name.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredGames(filtered);
    setUsingFilters(true);
  };
  return (
    <div className="purchases">
      <div className="purchases-search-wrapper">
        <form className="search-container" onSubmit={handleSearch}>
          <FontAwesomeIcon icon={faSearch} size="m" className="search-icon" />
          <input
            type="text"
            value={query}
            placeholder="Search for a purchase..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        {usingFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilteredGames(userGames);
              setUsingFilters(false);
            }}
            className="clear-filters-button"
          >
            <FontAwesomeIcon icon={faXmark} size="m" style={{ marginTop: "2px" }}/>
            Clear Filters
          </button>
        )}
      </div>
      <div className="purchases-container">
        <div className="purchases-header">
          <div className="purchase-col">Game</div>
          <div className="purchase-col">Name</div>
          <div className="purchase-col">Date</div>
          <div className="purchase-col">Amount</div>
          <div className="purchase-col">Type</div>
        </div>
        <div className="purchases-list">
          {sortedByNewest.length > 0 ? (
            sortedByNewest.map((expense, idx) => (
              <div className="purchase-row" key={idx}>
                <div className="purchase-col">
                  <div className="purchase-game-img">
                    <img src={expense.gameCoverUrl} alt="game cover" />
                  </div>
                  <span>{expense.gameName}</span>
                </div>
                <div className="purchase-col">{expense.name}</div>
                <div className="purchase-col">{formatDate(expense.date)}</div>
                <div className="purchase-col">
                  ${Number(expense.purchaseAmount).toFixed(2)}
                </div>
                <div className="purchase-col">{expense.type || "N/A"}</div>
              </div>
            ))
          ) : (
            <p>No purchases found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Purchases;
