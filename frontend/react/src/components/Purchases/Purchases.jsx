import { React, useState, useEffect } from "react";
import "./Purchases.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const Purchases = ({ user }) => {
  const [userGames, setUserGames] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [query, setQuery] = useState("");
  const [usingFilters, setUsingFilters] = useState(false);
  const [searchBy, setSearchBy] = useState("name"); // search by "name" or "game"
  const [filterType, setFilterType] = useState("None");
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  const handleClearFilters = () => {
    setQuery("");
    setFilterType("None");
    setUsingFilters(false);
    const rebuiltItems = userGames.flatMap((game) => {
      const expenses =
        game.expenses?.map((expense) => ({
          ...expense,
          type: "Expense",
          gameName: game.gameId.name,
          gameCoverUrl: game.gameId.coverUrl,
        })) || [];

      const subs =
        game.subscriptions?.map((sub) => ({
          ...sub,
          type: "Subscription",
          gameName: game.gameId.name,
          gameCoverUrl: game.gameId.coverUrl,
        })) || [];

      return [...expenses, ...subs];
    });
    setFilteredItems(rebuiltItems);
  };

  const sortedByNewest = filteredItems
    .slice() //to avoid mutating original state
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
          setUserGames(data.games || []);

          const allItems = (data.games || []).flatMap((game) => {
            const expenses =
              game.expenses?.map((expense) => ({
                ...expense,
                type: "Expense",
                gameName: game.gameId.name,
                gameCoverUrl: game.gameId.coverUrl,
              })) || [];

            const subscriptions =
              game.subscriptions?.map((sub) => ({
                ...sub,
                type: "Subscription",
                gameName: game.gameId.name,
                gameCoverUrl: game.gameId.coverUrl,
              })) || [];

            return [...expenses, ...subscriptions];
          });

          setFilteredItems(allItems);
        }
      } catch (err) {
        console.error("Failed to fetch user games!", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGames();
  }, []);
  const filterItems = (searchText = query, typeFilter = filterType) => {
    const allItems = userGames.flatMap((game) => {
      const expenses =
        game.expenses?.map((expense) => ({
          ...expense,
          type: "Expense",
          gameName: game.gameId.name,
          gameCoverUrl: game.gameId.coverUrl,
        })) || [];

      const subs =
        game.subscriptions?.map((sub) => ({
          ...sub,
          type: "Subscription",
          gameName: game.gameId.name,
          gameCoverUrl: game.gameId.coverUrl,
        })) || [];

      return [...expenses, ...subs];
    });

    let results = [];

    if (searchBy === "name") {
      results = allItems.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    } else if (searchBy === "game") {
      results = allItems.filter((item) =>
        item.gameName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (typeFilter !== "None") {
      results = results.filter((item) => item.type === typeFilter);
    }

    setFilteredItems(results);
    setUsingFilters(query !== "" || typeFilter !== "None");
  };
  const handleSearch = (e) => {
    e.preventDefault();
    filterItems();
  };
  useEffect(() => {
    if (filterType === "None" && query === "") {

      const allItems = userGames.flatMap((game) => {
        const expenses =
          game.expenses?.map((expense) => ({
            ...expense,
            type: "Expense",
            gameName: game.gameId.name,
            gameCoverUrl: game.gameId.coverUrl,
          })) || [];

        const subs =
          game.subscriptions?.map((sub) => ({
            ...sub,
            type: "Subscription",
            gameName: game.gameId.name,
            gameCoverUrl: game.gameId.coverUrl,
          })) || [];

        return [...expenses, ...subs];
      });

      setFilteredItems(allItems);
      setUsingFilters(false);
    } else {
      filterItems();
    }
  }, [filterType]);
  return (
    <div className="purchases">
      <div className="purchases-search-wrapper">
        <form className="search-container" onSubmit={handleSearch}>
          <FontAwesomeIcon icon={faSearch} size="m" className="search-icon" />
          <input
            type="text"
            value={query}
            placeholder={
              searchBy === "name"
                ? "Search for a purchase..."
                : "Search for a game..."
            }
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        <div className="filter-type-container">
          <label htmlFor="searchBy">Search By</label>
          <select
            name="searchBy"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="name">Purchase Name</option>
            <option value="game">Game</option>
          </select>
        </div>
        <div className="filter-type-container">
          <label htmlFor="searchByType">Type</label>
          <select
            name="searchByType"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              
            }}
          >
            <option value="None">None</option>
            <option value="Expense">Expense</option>
            <option value="Subscription">Subscription</option>
          </select>
        </div>
        {usingFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="clear-filters-button"
          >
            <FontAwesomeIcon
              icon={faXmark}
              size="m"
              style={{ marginTop: "2px" }}
            />
            Clear
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
