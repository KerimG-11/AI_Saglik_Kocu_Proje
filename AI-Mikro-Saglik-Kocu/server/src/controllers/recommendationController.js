const { getRecommendations } = require("../models/recommendationModel");

async function listRecommendations(req, res) {
  try {
    const recommendations = await getRecommendations(req.user.id);
    return res.json(recommendations);
  } catch (error) {
    return res.status(500).json({ message: "Oneriler alinamadi." });
  }
}

module.exports = { listRecommendations };
