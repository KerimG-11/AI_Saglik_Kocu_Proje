const { getNotifications } = require("../models/notificationModel");

async function listNotifications(req, res) {
  try {
    const notifications = await getNotifications(req.user.id);
    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: "Bildirimler alinamadi." });
  }
}

module.exports = { listNotifications };
