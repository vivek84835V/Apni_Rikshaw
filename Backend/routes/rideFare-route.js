const express = require("express");
const router = express.Router();
const { calculateFare } = require("../service/ride-service");

router.get("/fare", calculateFare);

module.exports = router;
