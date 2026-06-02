require("dotenv").config();
const app = require("./app");
const { getPool } = require("./config/db");
const util = require("util");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const pool = await getPool();
    await pool.request().query("SELECT 1 AS ok");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    const details = {
      message: error.message,
      code: error.code,
      name: error.name,
      original: error.originalError?.message || error.originalError || null,
      fullError: util.inspect(error, { depth: 4 }),
      host: process.env.DB_HOST || "localhost",
      database: process.env.DB_NAME || "ai_micro_health",
      trustedConnection: process.env.DB_TRUSTED_CONNECTION || "true"
    };
    console.error("Veritabani baglantisi basarisiz:", details);
    process.exit(1);
  }
}

startServer();
