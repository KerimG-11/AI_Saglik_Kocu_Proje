const { getPool, sql } = require("../config/db");

async function createUser({ name, email, password }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("name", sql.NVarChar(100), name)
    .input("email", sql.NVarChar(150), email)
    .input("password", sql.NVarChar(255), password)
    .query(`
      INSERT INTO users (name, email, password)
      OUTPUT INSERTED.id
      VALUES (@name, @email, @password)
    `);

  return result.recordset[0].id;
}

async function findUserByEmail(email) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("email", sql.NVarChar(150), email)
    .query("SELECT TOP 1 * FROM users WHERE email = @email");
  return result.recordset[0] || null;
}

module.exports = { createUser, findUserByEmail };
