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
  connectionLimit: 10,
  queueLimit: 0
});


export async function initDB(): Promise<void> {
  try {
    const connection = await pool.getConnection();

    console.log('✅ Pool MySQL conectado');

    await createTables(connection);

    connection.release();
  } catch (error) {
    console.error('❌ Error inicializando DB:', error);
    throw error;
  }
}

async function createTables(connection: mysql.PoolConnection): Promise<void> {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  const medicationsTable = `
    CREATE TABLE IF NOT EXISTS medications (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      price DECIMAL(10,2) NOT NULL,
      expiration_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  await connection.execute(usersTable);
  await connection.execute(medicationsTable);

  console.log('✅ Tablas listas');
}
