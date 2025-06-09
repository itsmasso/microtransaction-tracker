import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const ExpenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purchaseAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});
const SubscriptionsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purchaseAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  recurrence: {
    type: String,
    enum: ["none", "weekly", "monthly", "yearly"],
    default: "monthly",
  },
});

const GameExpenseDetailsSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: "users", required: true },
  gameId: { type: ObjectId, ref: "games", required: true },
  expenses: [ExpenseSchema],
  subscriptions: [SubscriptionsSchema],
  addedAt: { type: Date, default: Date.now },
});

const GameExpenseDetails = mongoose.model(
  "gameexpensedetails",
  GameExpenseDetailsSchema
);
export default GameExpenseDetails;
