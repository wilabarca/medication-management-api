import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    console.log('🔄 Creando nuevo pool de conexiones MySQL');
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT ?? 3306),
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0
    });
  }
  return pool;
}

export async function initDB(): Promise<void> {
  let connection;
  try {
    const currentPool = getPool();
    connection = await currentPool.getConnection();
    console.log('✅ Pool MySQL conectado correctamente');
    
    // Verificar conexión ejecutando una consulta simple
    await connection.query('SELECT 1');
    console.log('✅ Conexión MySQL verificada');
    
    connection.release();
  } catch (error) {
    console.error('❌ Error inicializando DB:', error);
    // Si hay error, resetear el pool
    if (pool) {
      try {
        await pool.end();
      } catch (e) {
        console.error('Error cerrando pool:', e);
      }
      pool = null;
    }
    throw error;
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    try {
      await pool.end();
      console.log('✅ Pool MySQL cerrado correctamente');
    } catch (error) {
      console.error('❌ Error cerrando pool:', error);
    } finally {
      pool = null;
    }
  }
}

// Función para verificar la salud de la conexión
export async function checkHealth(): Promise<boolean> {
  try {
    const currentPool = getPool();
    const connection = await currentPool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Health check falló:', error);
    // Si el pool está roto, resetearlo
    if (pool) {
      try {
        await pool.end();
      } catch (e) {
        // Ignorar error al cerrar
      }
      pool = null;
    }
    return false;
  }
}