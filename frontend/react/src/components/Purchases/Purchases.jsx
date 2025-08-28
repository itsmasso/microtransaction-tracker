import { React, useState, useEffect } from "react";
import "./Purchases.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../util/DateFormatter";
import { flattenUserGames, sortItems } from "../../util/ExpenseUtil";
import { paginate } from "../../util/PaginationUtil";
import Pagination from "../Pagination/Pagination";
import spinner from "../../assets/spinner.svg";
import { getDemoData } from "../../util/demoData";
const Purchases = ({ isDemo }) => {
  const [userGames, setUserGames] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [query, setQuery] = useState("");
  const [usingFilters, setUsingFilters] = useState(false);
  const [searchBy, setSearchBy] = useState("name"); // search by "name" or "game"
  const [filterType, setFilterType] = useState("None");
  const [sortType, setSortType] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc"); //set asc or desc (ascending or descending)
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const handleClearFilters = () => {
    setQuery("");
    setFilterType("None");
    setUsingFilters(false);
    if (userGames && userGames.length > 0) {
      const rebuiltItems = flattenUserGames(userGames);
      setFilteredItems(rebuiltItems);
    }
    setCurrentPage(1);
  };

  const sortedItems = sortItems(filteredItems, sortType, sortOrder);
  const itemsPerPage = 10;
  const currentItems = paginate(sortedItems, currentPage, itemsPerPage);

  const handleSort = (key) => {
    if (sortType === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortType(key);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    const fetchUserGames = async () => {
      setLoading(true);
      try {
        if (isDemo) {
          // In demo mode, use demo data
          const demoData = getDemoData();
          setUserGames(demoData);
          const allItems = flattenUserGames(demoData);
          setFilteredItems(allItems);
        } else {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/games/get-user-games`,
            { method: "GET", credentials: "include" }
          );

          if (response.ok) {
            const data = await response.json();
            setUserGames(data.games || []);

            const allItems = flattenUserGames(data.games || []);
            setFilteredItems(allItems);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user games!", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGames();
  }, [isDemo]);
  const filterItems = (searchText = query, typeFilter = filterType) => {
    // Don't process if userGames is empty
    if (!userGames || userGames.length === 0) {
      return;
    }
    
    const allItems = flattenUserGames(userGames);

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
    setCurrentPage(1);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    filterItems();
  };
  useEffect(() => {
    if (filterType === "None" && query === "") {
      if (userGames && userGames.length > 0) {
        const allItems = flattenUserGames(userGames);
        setFilteredItems(allItems);
      }
      setUsingFilters(false);
    } else {
      filterItems();
    }
  }, [filterType]);
  return (
    <div className="purchases">
      {loading && <img src={spinner} alt="loading image" className="spinner"/>}
      <div className="purchases-header">
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
          <label htmlFor="searchByType">Filter Type</label>
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
        <div className="sort-container">
          <div className="filter-type-container">
            <label htmlFor="sortBy">Sort Type</label>
            <select
              name="sortBy"
              value={sortType}
              onChange={(e) => {
                setSortType(e.target.value);
              }}
            >
              <option value="date">Date</option>
              <option value="purchaseAmount">Cost</option>
            </select>
          </div>
          <button
            onClick={() =>
              sortType === "purchaseAmount"
                ? handleSort("purchaseAmount")
                : handleSort("date")
            }
          >
            {sortOrder === "asc" ? (
              <FontAwesomeIcon icon={faArrowUp} size="m" />
            ) : (
              <FontAwesomeIcon icon={faArrowDown} size="m" />
            )}
          </button>
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
      {!loading && (
        <div className="purchases-container">
          <div className="purchases-container-header">
            <div className="purchase-col">Game</div>
            <div className="purchase-col">Name</div>
            <div className="purchase-col">Date</div>
            <div className="purchase-col">Amount</div>
            <div className="purchase-col">Type</div>
          </div>
          <div className="purchases-list">
            {loading ? (
              <img src={spinner} alt="loading image" />
            ) : currentItems.length > 0 ? (
              currentItems.map((expense, idx) => (
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
            {!loading && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(sortedItems.length / itemsPerPage)}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
