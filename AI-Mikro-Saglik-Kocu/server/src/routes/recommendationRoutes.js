const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { listRecommendations } = require("../controllers/recommendationController");

const router = express.Router();

router.get("/recommendations", authMiddleware, listRecommendations);

module.exports = router;
