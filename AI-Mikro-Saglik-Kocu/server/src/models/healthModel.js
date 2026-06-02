const { getPool, sql } = require("../config/db");

async function createHealthData(userId, data) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("user_id", sql.Int, userId)
    .input("sleep_hours", sql.Decimal(4, 2), data.sleep_hours)
    .input("step_count", sql.Int, data.step_count)
    .input("water_amount", sql.Decimal(4, 2), data.water_amount)
    .input("stress_level", sql.Int, data.stress_level)
    .query(`
      INSERT INTO health_data (user_id, sleep_hours, step_count, water_amount, stress_level)
      OUTPUT INSERTED.id
      VALUES (@user_id, @sleep_hours, @step_count, @water_amount, @stress_level)
    `);

  return result.recordset[0].id;
}

async function getHealthHistory(userId) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("user_id", sql.Int, userId)
    .query(`
      SELECT id, sleep_hours, step_count, water_amount, stress_level, created_at
      FROM health_data
      WHERE user_id = @user_id
      ORDER BY created_at DESC
    `);
  return result.recordset;
}

async function getLatestHealthData(userId) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("user_id", sql.Int, userId)
    .query(`
      SELECT TOP 1 sleep_hours, step_count, water_amount, stress_level, created_at
      FROM health_data
      WHERE user_id = @user_id
      ORDER BY created_at DESC
    `);
  return result.recordset[0] || null;
}

module.exports = {
  createHealthData,
  getHealthHistory,
  getLatestHealthData
};
