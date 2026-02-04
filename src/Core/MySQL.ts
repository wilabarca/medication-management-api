import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB(): Promise<mysql.Connection> {
  try {
    // Crear conexión
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306
    });

    console.log('✅ Conexión a la base de datos exitosa');

    // Crear tablas si no existen
    await createTables(connection);

    return connection;
  } catch (error) {
    console.error('❌ Error al conectar la base de datos:', error);
    throw error;
  }
}

async function createTables(connection: mysql.Connection): Promise<void> {
  try {
    // Tabla de usuarios
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

    // Tabla de medicamentos
    const medicationsTable = `
      CREATE TABLE IF NOT EXISTS medications (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        price DECIMAL(10, 2) NOT NULL,
        expiration_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    // Ejecutar creación de tablas
    await connection.execute(usersTable);
    console.log('✅ Tabla users creada o ya existe');

    await connection.execute(medicationsTable);
    console.log('✅ Tabla medications creada o ya existe');

  } catch (error) {
    console.error('❌ Error creando tablas:', error);
    throw error;
  }
}

// Función para cerrar la conexión
export async function closeDB(connection: mysql.Connection): Promise<void> {
  await connection.end();
  console.log('🔒 Conexión a la base de datos cerrada');
}