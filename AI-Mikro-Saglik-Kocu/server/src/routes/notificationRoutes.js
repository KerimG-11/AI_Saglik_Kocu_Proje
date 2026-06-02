const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { listNotifications } = require("../controllers/notificationController");

const router = express.Router();

router.get("/notifications", authMiddleware, listNotifications);

module.exports = router;
