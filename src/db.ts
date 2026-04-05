import { Pool } from "pg";
import { env } from "./env";

const pool = new Pool({
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_DB,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
  ssl: env.DB_SSL ? { rejectUnauthorized: true } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Unexpected pg pool error:", err.message);
});

const db = {
  async query(
    text: string,
    values?: (string | number | boolean | null | undefined | Date)[]
  ) {
    const client = await pool.connect();
    try {
      const result = await client.query(text, values);
      return result.rows;
    } finally {
      client.release();
    }
  },

  async queryViaTransaction(
    text: string,
    values?: (string | number | boolean | null | undefined | Date)[]
  ) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query(text, values);
      await client.query("COMMIT");
      return result.rows;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  async isConnected(): Promise<boolean> {
    try {
      await pool.query("SELECT 1");
      return true;
    } catch {
      return false;
    }
  },

  async end() {
    await pool.end();
  },
};

export default db;
