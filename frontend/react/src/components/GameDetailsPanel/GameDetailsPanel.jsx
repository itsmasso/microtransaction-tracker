import React from "react";
import "./GameDetailsPanel.css";
import { useState } from "react";
import { useEffect } from "react";

const GameDetailsPanel = ({ userGame, onClose, onExpensesChange }) => {
  const expenses = userGame.expenses || [];
  const [newExpense, setNewExpense] = useState({
    name: "",
    purchaseAmount: "",
    date: new Date().toISOString().split("T")[0],
  });
  const totalSpent = expenses.reduce(
    (sum, expense) => sum + Number(expense.purchaseAmount),
    0
  );

  const handleAddExpense = async () => {
    if (!newExpense.name || !newExpense.purchaseAmount) return;

    try {
      const response = await fetch(
        "http://localhost:5000/games/update-game-expense",
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
        const updated = [newExpense, ...expenses];
        onExpensesChange(userGame.gameId._id, updated);
        setNewExpense({
          name: "",
          purchaseAmount: "",
          date: new Date().toISOString().split("T")[0],
        });
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  const handleDeleteExpense = async (index) => {
    try {
      const response = await fetch(
        `http://localhost:5000/games/delete-game-expense/${userGame.gameId._id}/${index}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        console.log("Successfully deleted expense!");
        const updated = expenses.filter((_, i) => i !== index);
        onExpensesChange(userGame.gameId._id, updated);
        if (onUpdate) onUpdate();
      } else {
        console.error("Failed to delete expense.");
      }
    } catch (err) {
      console.error("Failed to delete expense.", err);
    }
  };

  return (
    <div>
      <div className="panel-overlay" onClick={onClose} />
      <div className="panel">
        <header className="panel-header">
          <h2>{userGame.gameId.name}</h2>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </header>
        <div className="panel-content">
          <img
            src={userGame.gameId.coverUrl}
            alt={userGame.gameId.name}
            className="panel-image"
          />
          <p>
            <strong>Platforms:</strong> {userGame.gameId.platform?.join(", ")}
          </p>
          <div>{`total spent: ${totalSpent}`}</div>
          <hr />
          <div className="expense-form">
            <h4>Add Expense</h4>
            <input
              type="text"
              placeholder="Expense Name"
              value={newExpense.name}
              onChange={(e) =>
                setNewExpense({ ...newExpense, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.purchaseAmount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, purchaseAmount: e.target.value })
              }
            />
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
            />
            <button onClick={handleAddExpense}>Add</button>
          </div>

          <div className="expenses-scroll">
            <h4>Expenses</h4>
            <ul>
              {expenses.map((exp, idx) => (
                <li key={idx} className="expense-item">
                  <div>
                    <strong>{exp.name}</strong> — ${exp.purchaseAmount}
                    <br />
                    <small>{new Date(exp.date).toLocaleDateString()}</small>
                  </div>
                  <button onClick={() => handleDeleteExpense(idx)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPanel;
