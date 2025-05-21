import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const UserGamesSchema = new mongoose.Schema({
  userId: {type: ObjectId, required: true}, 
  gameCardId: {type: ObjectId, required: true},
  purchasePlatforms: {type: [String], default: []},
  purchaseEmail: {type: String},
  receiptEmails: {type: [String], default: []},
  keywords: {type: [String], default: []}, //optional tags to help match
  addedAt: { type: Date, default: Date.now },
});

const UserGamesModel = mongoose.model("UserGames", UserGamesSchema);
export default UserGamesModel;