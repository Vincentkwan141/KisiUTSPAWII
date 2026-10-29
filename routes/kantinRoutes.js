const express = require("express");
const router = express.Router();
const kantinController = require("../controllers/kantinController");

router.get("/", kantinController.getAll);
router.post("/", kantinController.create);

module.exports = router;
