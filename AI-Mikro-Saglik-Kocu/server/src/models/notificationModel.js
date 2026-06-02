const { getPool, sql } = require("../config/db");

async function createNotifications(userId, notificationList) {
  if (!notificationList.length) return;
  const pool = await getPool();

  for (const text of notificationList) {
    await pool
      .request()
      .input("user_id", sql.Int, userId)
      .input("notification_text", sql.NVarChar(sql.MAX), text)
      .query(`
        INSERT INTO notifications (user_id, notification_text, is_read)
        VALUES (@user_id, @notification_text, 0)
      `);
  }
}

async function getNotifications(userId) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("user_id", sql.Int, userId)
    .query(`
      SELECT TOP 30 id, notification_text, is_read, created_at
      FROM notifications
      WHERE user_id = @user_id
      ORDER BY created_at DESC
    `);
  return result.recordset;
}

module.exports = {
  createNotifications,
  getNotifications
};
