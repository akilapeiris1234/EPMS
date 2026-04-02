import sql from "mssql";

const config = {
  user: "myuser",
  password: "1234",
  server: "127.0.0.1",
  port: 1433,
  database: "GuardSystemDB",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

export async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log("✅ Connected to SQL Server");
  }
  return pool;
}

export { sql };