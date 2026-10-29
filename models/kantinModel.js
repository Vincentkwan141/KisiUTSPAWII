const mongoose = require("mongoose");

const kantinSchema = new mongoose.Schema({
  nama: { type: String, required: true, unique: true, trim: true },
  lokasi: { type: String, default: "" },
});

module.exports = mongoose.model("Kantin", kantinSchema);
