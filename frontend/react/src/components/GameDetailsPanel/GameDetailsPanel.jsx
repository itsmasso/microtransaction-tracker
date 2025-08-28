import React from "react";
import "./GameDetailsPanel.css";
import { useState } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { getDaysRemaining } from "../../util/SubscriptionCounter";
import { useSignupModal } from "../../context/SignupModalContext";

const GameDetailsPanel = ({
  userGame,
  onClose,
  onGameDetailChange,
  onDeleteUserGame,
  isDemo,
}) => {
  const { openSignupModal } = useSignupModal();
  const expenses = userGame.expenses || [];
  const [newExpense, setNewExpense] = useState({
    name: "",
    purchaseAmount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const subscriptions = userGame.subscriptions || [];
  const [newSubscription, setNewSubscription] = useState({
    name: "",
    purchaseAmount: "",
    date: new Date().toISOString().split("T")[0],
    recurrence: "monthly",
  });

  const totalSpent =
    expenses.reduce((sum, expense) => sum + Number(expense.purchaseAmount), 0) +
    subscriptions.reduce((sum, sub) => sum + Number(sub.purchaseAmount), 0);

  const formatDateUTC = (isoDateStr) => {
    const date = new Date(isoDateStr);
    return date.toLocaleDateString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const handleAddExpense = async () => {
    if (!newExpense.name || !newExpense.purchaseAmount) return;

    if (isDemo) {
      // Show signup prompt for demo users
      openSignupModal();
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/games/update-game-expense`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            gameId: userGame.gameId._id,
            expenses: [newExpense],
          }),
        }
      );

      if (response.ok) {
        const updatedExpenses = [newExpense, ...expenses];
        onGameDetailChange(userGame.gameId._id, { expenses: updatedExpenses });
        setNewExpense({
          name: "",
          purchaseAmount: "",
          date: new Date().toISOString().split("T")[0],
        });
      }
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  const handleDeleteExpense = async (index) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/games/delete-game-expense/${userGame.gameId._id}/${index}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        console.log("Successfully deleted expense!");
        const updatedExpenses = expenses.filter((_, i) => i !== index);
        onGameDetailChange(userGame.gameId._id, { expenses: updatedExpenses });
      } else {
        console.error("Failed to delete expense.");
      }
    } catch (err) {
      console.error("Failed to delete expense.", err);
    }
  };

  const handleAddSubscriptions = async () => {
    if (
      !newSubscription.name ||
      !newSubscription.purchaseAmount ||
      !newSubscription.recurrence
    )
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/games/update-subscription`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            gameId: userGame.gameId._id,
            subscriptions: [newSubscription],
          }),
        }
      );

      if (response.ok) {
        const updatedSubscriptions = [newSubscription, ...subscriptions];
        onGameDetailChange(userGame.gameId._id, {
          subscriptions: updatedSubscriptions,
        });
        console.log("Sending subscription:", updatedSubscriptions);
        setNewSubscription({
          name: "",
          purchaseAmount: "",
          date: new Date().toISOString().split("T")[0],
          recurrence: "monthly",
        });
      }
    } catch (err) {
      console.error("Failed to add subscription:", err);
    }
  };

  const handleDeleteSubscription = async (index) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/games/delete-subscription/${userGame.gameId._id}/${index}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        console.log("Successfully cancelled subscription!");
        const updatedSubscriptions = subscriptions.filter(
          (_, i) => i !== index
        );
        onGameDetailChange(userGame.gameId._id, {
          subscriptions: updatedSubscriptions,
        });
      } else {
        console.error("Failed to delete subscription.");
      }
    } catch (err) {
      console.error("Failed to delete subscription.", err);
    }
  };
  const handleDeleteGame = async () => {
    if (isDemo) {
      openSignupModal();
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/games/delete-user-game`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            gameId: userGame.gameId._id,
          }),
        }
      );
      if (response.ok) {
        console.log("Successfully removed game from library!");
        onDeleteUserGame(userGame.gameId._id);
        onClose();
      } else {
        console.error("Failed to delete subscription.");
      }
    } catch (err) {
      console.error("Failed to delete subscription.", err);
    }
  };
  return (
    <div>
      <div className="panel-overlay" onClick={onClose} />
      <div className="panel">
        <header className="panel-header">
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faArrowLeftLong} size="m" />
          </button>
        </header>
        <div className="panel-content">
          <div className="panel-game-details">
            <div className="panel-game-details-left">
              <h1>{userGame.gameId.name}</h1>
              <div className="panel-game-details-total">
                <span>Total spent</span>
                <h1>${Number(totalSpent).toFixed(2).replace(/\.00$/, '')}</h1>
              </div>
              <p>
                <strong>Date added:</strong> {formatDateUTC(userGame.addedAt)}
              </p>
              <button className="delete-game-button" onClick={handleDeleteGame}>
                <FontAwesomeIcon icon={faXmarkCircle} size="m" />
                Remove Game
              </button>
            </div>
            <div className="panel-image-container">
              <img src={userGame.gameId.coverUrl} alt={userGame.gameId.name} />
            </div>
          </div>

          <div className="panel-forms">
            <div className="panel-forms-wrapper">
              <div className="expense-form">
                <div className="panel-form-container">
                  <h4>Add Expense</h4>
                  <input
                    type="text"
                    placeholder="Expense Name"
                    value={newExpense.name}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, name: e.target.value })
                    }
                  />
                </div>
                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.purchaseAmount}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      purchaseAmount: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                />
                <button onClick={handleAddExpense} className="blue-button">
                  Add Expense
                </button>
              </div>
              <div className="expenses-scroll">
                <div className="panel-form-container">
                  <h4>Expenses</h4>
                  {expenses.length === 0 ? (
                    <p>No expenses yet.</p>
                  ) : (
                    <ul>
                      {expenses.map((exp, idx) => (
                        <li key={idx} className="expense-item">
                          <div className="expense-info">
                            <strong className="expense-name">{exp.name}</strong>
                            <div className="expense-date">
                              {new Date(exp.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>

                          <div className="expense-price">
                            $ {Number(exp.purchaseAmount).toFixed(2)}
                          </div>

                          <button
                            className="delete-expense"
                            onClick={() => handleDeleteExpense(idx)}
                          >
                            <FontAwesomeIcon icon={faXmark} size="m" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="panel-forms-wrapper">
              <div className="subscriptions-form">
                <div className="panel-form-container">
                  <h4>Add Subscription</h4>
                  <input
                    type="text"
                    placeholder="Subscription Name"
                    value={newSubscription.name}
                    onChange={(e) =>
                      setNewSubscription({
                        ...newSubscription,
                        name: e.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Amount"
                    value={newSubscription.purchaseAmount}
                    onChange={(e) =>
                      setNewSubscription({
                        ...newSubscription,
                        purchaseAmount: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="subscription-date">
                  <div className="panel-form-container">
                    <label htmlFor="startDate">Date added</label>
                    <input
                      name="startDate"
                      type="date"
                      value={newSubscription.date}
                      onChange={(e) =>
                        setNewSubscription({
                          ...newSubscription,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="panel-form-container">
                    <label htmlFor="recurrence">Billing Cycle</label>
                    <select
                      name="recurrence"
                      value={newSubscription.recurrence}
                      onChange={(e) =>
                        setNewSubscription({
                          ...newSubscription,
                          recurrence: e.target.value,
                        })
                      }
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddSubscriptions}
                  className="blue-button"
                >
                  Add Subscription
                </button>
              </div>

              <div className="expenses-scroll">
                <div className="panel-form-container">
                  <h4>Subscriptions</h4>
                  {subscriptions.length === 0 ? (
                    <p>No subscriptions yet.</p>
                  ) : (
                    <ul>
                      {subscriptions.map((sub, idx) => (
                        <li key={idx} className="expense-item">
                          <div className="expense-info">
                            <strong className="expense-name">{sub.name}</strong>
                            <span className="subscription-tag">
                              {getDaysRemaining(sub.date, sub.recurrence)} days
                              left
                            </span>
                          </div>

                          <div className="expense-price">
                            $ {Number(sub.purchaseAmount).toFixed(2)}
                          </div>

                          <button
                            className="delete-expense"
                            onClick={() => handleDeleteSubscription(idx)}
                          >
                            <FontAwesomeIcon icon={faXmark} size="m" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPanel;
