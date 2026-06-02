const useTrustedConnection = String(process.env.DB_TRUSTED_CONNECTION || "true").toLowerCase() === "true";
const sql = useTrustedConnection ? require("mssql/msnodesqlv8") : require("mssql");
const rawHost = process.env.DB_HOST || "localhost";
const dbName = process.env.DB_NAME || "ai_micro_health";

const config = {
  server: rawHost,
  database: dbName,
  options: {
    trustedConnection: useTrustedConnection,
    trustServerCertificate: true
  }
};

if (useTrustedConnection) {
  config.driver = "msnodesqlv8";
  config.connectionString =
    `Driver={ODBC Driver 17 for SQL Server};` +
    `Server=${rawHost};` +
    `Database=${dbName};` +
    "Trusted_Connection=Yes;";
} else {
  config.user = process.env.DB_USER;
  config.password = process.env.DB_PASSWORD;
}

let poolPromise;

function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config).connect();
  }
  return poolPromise;
}

module.exports = {
  sql,
  getPool
};
