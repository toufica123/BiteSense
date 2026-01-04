const express = require("express");
const { streamChat } = require("../controllers/streamController");

const router = express.Router();

router.post("/", streamChat);

module.exports = router;