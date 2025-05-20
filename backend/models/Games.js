import mongoose from 'mongoose';

const GamesSchema = new mongoose.Schema({
igdbId: { type: Number, unique: true },
name: {type: String, required: true},
platform: {type: [String], default: []},
coverUrl: {type: String},
cachedAt: { type: Date, default: Date.now }

});

const GamesModel = mongoose.model("games", GamesSchema);
export default GamesModel;