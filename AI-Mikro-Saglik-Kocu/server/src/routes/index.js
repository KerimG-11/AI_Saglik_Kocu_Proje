const express = require("express");
const authRoutes = require("./authRoutes");
const healthRoutes = require("./healthRoutes");
const recommendationRoutes = require("./recommendationRoutes");
const notificationRoutes = require("./notificationRoutes");

const router = express.Router();

router.use("/api", authRoutes);
router.use("/api", healthRoutes);
router.use("/api", recommendationRoutes);
router.use("/api", notificationRoutes);

module.exports = router;
