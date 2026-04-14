import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let connection: mysql.Connection | null = null;

export async function getConnection(): Promise<mysql.Connection> {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      port: Number(process.env.DB_PORT ?? 3306),
      connectTimeout: 10000
    });
  }
  return connection;
}

export async function closeConnection(): Promise<void> {
  if (connection) {
    await connection.end().catch(() => {});
    connection = null;
  }
}

export async function initDB(): Promise<void> {
  try {
    const conn = await getConnection();
    await conn.query('SELECT 1');
    console.log('✅ MySQL conectado');
  } catch (error) {
    console.error('❌ Error conectando DB:', error);
    connection = null;
    throw error;
  }
}

// Exportar pool como alias para compatibilidad con repositorios
export const pool = {
  execute: async (sql: string, params?: any[]) => {
    const conn = await getConnection();
    return conn.execute(sql, params);
  },
  getConnection: async () => {
    const conn = await getConnection();
    return { ...conn, release: () => {} };
  }
} as any;