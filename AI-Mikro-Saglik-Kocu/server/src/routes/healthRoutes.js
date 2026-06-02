const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { validateHealthData } = require("../middlewares/validateMiddleware");
const { saveHealthData, getHistory, getDailySummary } = require("../controllers/healthController");

const router = express.Router();

router.post("/health", authMiddleware, validateHealthData, saveHealthData);
router.get("/health/history", authMiddleware, getHistory);
router.get("/health/summary", authMiddleware, getDailySummary);

module.exports = router;
