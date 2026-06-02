const {
  createHealthData,
  getHealthHistory,
  getLatestHealthData
} = require("../models/healthModel");
const { createRecommendations } = require("../models/recommendationModel");
const { createNotifications } = require("../models/notificationModel");
const { generateRecommendations } = require("../utils/recommendationEngine");

async function saveHealthData(req, res) {
  try {
    const userId = req.user.id;
    const data = req.body;

    await createHealthData(userId, data);

    const recommendations = generateRecommendations(data);
    await createRecommendations(userId, recommendations);
    await createNotifications(userId, recommendations.map((item) => `Mikro Oneri: ${item}`));

    return res.status(201).json({
      message: "Saglik verisi kaydedildi.",
      recommendations
    });
  } catch (error) {
    return res.status(500).json({ message: "Veri kaydedilirken hata olustu." });
  }
}

async function getHistory(req, res) {
  try {
    const userId = req.user.id;
    const history = await getHealthHistory(userId);
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: "Gecmis veriler alinamadi." });
  }
}

async function getDailySummary(req, res) {
  try {
    const latest = await getLatestHealthData(req.user.id);
    return res.json(latest);
  } catch (error) {
    return res.status(500).json({ message: "Ozet verisi alinamadi." });
  }
}

module.exports = { saveHealthData, getHistory, getDailySummary };
