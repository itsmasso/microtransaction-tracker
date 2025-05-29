import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const ExpenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purchaseAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const GameExpenseDetailsSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: "users", required: true },
  gameId: { type: ObjectId, ref: "games", required: true },
  expenses: [ExpenseSchema],
  addedAt: { type: Date, default: Date.now },
});

const GameExpenseDetails = mongoose.model("gameexpensedetails", GameExpenseDetailsSchema);
export default GameExpenseDetails;