const express = require("express");
const { chat } = require("../controllers/chatControllerImproved");

const router = express.Router();

router.post("/", chat);

module.exports = router;
