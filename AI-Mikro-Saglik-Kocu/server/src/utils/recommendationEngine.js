function generateRecommendations(healthData) {
  const recommendations = [];

  if (healthData.sleep_hours < 6) {
    recommendations.push("Bugun daha erken uyumayi deneyin.");
  }
  if (healthData.step_count < 5000) {
    recommendations.push("10 dakikalik yuruyus yapabilirsiniz.");
  }
  if (healthData.water_amount < 2) {
    recommendations.push("Daha fazla su icmeniz onerilir.");
  }
  if (healthData.stress_level > 7) {
    recommendations.push("5 dakika nefes egzersizi yapmayi deneyin.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Harika gidiyorsunuz, gunluk rutininizi koruyun.");
  }

  return recommendations;
}

module.exports = { generateRecommendations };
