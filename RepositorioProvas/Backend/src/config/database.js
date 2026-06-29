const sql = require("mssql");
require("dotenv").config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT || 1433),
    options: {
        encrypt: String(process.env.DB_ENCRYPT).toLowerCase() === "true",
        trustServerCertificate: String(process.env.DB_TRUST_CERT).toLowerCase() === "true"
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let poolPromise = null;

async function getPool() {
    if (poolPromise) return poolPromise;
    poolPromise = new sql.ConnectionPool(config).connect();
    return poolPromise;
}

module.exports = {
    sql,
    getPool
};