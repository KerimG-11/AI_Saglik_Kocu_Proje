const { getPool, sql } = require("../config/db");

async function createRecommendations(userId, recommendationList) {
  if (!recommendationList.length) return;
  const pool = await getPool();

  for (const text of recommendationList) {
    await pool
      .request()
      .input("user_id", sql.Int, userId)
      .input("recommendation_text", sql.NVarChar(sql.MAX), text)
      .query(`
        INSERT INTO recommendations (user_id, recommendation_text)
        VALUES (@user_id, @recommendation_text)
      `);
  }
}

async function getRecommendations(userId) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("user_id", sql.Int, userId)
    .query(`
      SELECT TOP 30 id, recommendation_text, created_at
      FROM recommendations
      WHERE user_id = @user_id
      ORDER BY created_at DESC
    `);
  return result.recordset;
}

module.exports = {
  createRecommendations,
  getRecommendations
};
