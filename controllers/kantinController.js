const Kantin = require("../models/kantinModel");

exports.getAll = async (req, res) => {
  const data = await Kantin.find().sort({ nama: 1 });
  res.json(data);
};

exports.create = async (req, res) => {
  const kantin = await Kantin.create(req.body);
  res.status(201).json(kantin);
};
