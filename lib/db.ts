import mysql from "mysql2/promise";

const config: mysql.PoolOptions = {
  host: process.env.MYSQLHOST || "127.0.0.1",
  port: parseInt(process.env.MYSQLPORT || "3306", 10),
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "GuardSystemDB",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00",
};

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(config);
    console.log("MySQL connection pool created");
  }

  return pool;
}

/**
 * Returns the MySQL pool.
 */
export async function getConnection(): Promise<mysql.Pool> {
  return getPool();
}

/**
 * Legacy export compatibility
 */
export { mysql as sql };