import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT ?? 3306),
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 10000,
  idleTimeout: 30000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export async function initDB(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Pool MySQL conectado');
    connection.release();
  } catch (error) {
    console.error('❌ Error inicializando DB:', error);
    throw error;
  }
}