import { React, useState, useEffect } from "react";
import "./Analytics.css";
import { getDaysRemaining } from "../../util/SubscriptionCounter";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import spinner from "../../assets/spinner.svg";
const Analytics = ({ user }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const [userGames, setUserGames] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [loading, setLoading] = useState(false);

  const yearList = [];
  const getMonthlyTotals = (selectedYear) => {
    const monthlyTotals = new Array(12).fill(0);
    userGames.forEach((game) => {
      game.expenses
        .filter((expense) => {
          const year = new Date(expense.date).getFullYear();
          return year === Number(selectedYear);
        })
        .forEach((expense) => {
          const monthIndex = new Date(expense.date).getMonth();
          monthlyTotals[monthIndex] += Number(expense.purchaseAmount);
        });
    });
    return monthlyTotals;
  };
  const getYearList = () => {
    const allExpenses = userGames.flatMap((game) => game.expenses);
    const years = allExpenses.map((exp) => new Date(exp.date).getFullYear());
    const earliestYear = Math.min(...years);
    const currentYear = new Date().getFullYear();
    for (let y = earliestYear; y <= currentYear; y++) {
      yearList.push(y);
    }
    return yearList;
  };

  const getActiveSubscriptions = () => {
    const subscriptions = userGames.flatMap((game) => {
      return game.subscriptions.map((sub) => ({
        name: sub.name,
        gameName: game.gameId.name,
        gameCoverUrl: game.gameId.coverUrl,
        purchaseAmount: sub.purchaseAmount,
        timeRemaining: getDaysRemaining(sub.date, sub.recurrence),
      }));
    });
    console.log(subscriptions);
    return subscriptions;
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
          setUserGames(data.games || []);
        }
      } catch (err) {
        console.error("Failed to fetch user games!", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserGames();
  }, []);

  const expenseData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Total Spent",
        data: getMonthlyTotals(selectedYear),
        backgroundColor: "#3a96df",
        borderRadius: 6,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            family: "'Outfit', sans-serif",
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.formattedValue}`,
        },
        bodyFont: {
          family: "'Outfit', sans-serif",
          size: 12,
        },
        backgroundColor: "#2e323d",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `$${val}`,
          font: {
            family: "'Outfit', sans-serif",
            size: 12,
          },
        },
        grid: {
          color: "#61656e",
        },
      },
      x: {
        ticks: {
          font: {
            family: "'Outfit', sans-serif",
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };
  return (
    <div className="statistics">
      {loading && <img src={spinner} alt="loading image" className="spinner" />}
      {!loading && (
        <div className="statistics-card">
          <div className="statistics-card-header">
            <h2>Yearly Transactions</h2>
            <div className="filter-type-container">
              {userGames.length > 0 && (
                <select
                  name="filterByYear"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                  }}
                >
                  {getYearList()
                    .sort((a, b) => {
                      return b - a;
                    })
                    .map((year) => (
                      <option value={`${year}`}>{year}</option>
                    ))}
                </select>
              )}
            </div>
          </div>
          <Bar data={expenseData} options={options} />
        </div>
      )}
      {!loading && (
        <div className="statistics-page-right">
          <div className="page-card sub-cost-total">
            <h1>$0</h1>
            <span>Spent monthly on subscriptions</span>
          </div>
          <div className="page-card active-subs-card">
            <div className="page-card-header">
              <h2>Active Subscriptions</h2>
            </div>
            <div className="active-subscription-card scroll">
              {getActiveSubscriptions().length === 0 ? (
                <p>You have no active subscriptions.</p>
              ) : (
                getActiveSubscriptions().map((sub) => (
                  <div className="subs-image-overlay-card">
                    <img src={sub.gameCoverUrl} alt="subscription game cover" />
                    <div className="subs-image-overlay-bg-fade" />
                    <div className="subs-image-overlay-card-content">
                      <div className="sub-days-remaining">
                        <h2 className="sub-cost">$ {sub.purchaseAmount}</h2>
                        <span>{sub.timeRemaining} days remaining</span>
                      </div>
                      <div className="sub-name">
                        <h2>{sub.name}</h2>
                        <span>{sub.gameName}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
