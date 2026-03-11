"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.initDB = initDB;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT ?? 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
async function initDB() {
    try {
        const connection = await exports.pool.getConnection();
        console.log('✅ Pool MySQL conectado');
        await createTables(connection);
        connection.release();
    }
    catch (error) {
        console.error('❌ Error inicializando DB:', error);
        throw error;
    }
}
async function createTables(connection) {
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
    await connection.execute(usersTable);
    await connection.execute(medicationsTable);
    console.log('✅ Tablas listas');
}
//# sourceMappingURL=MySQL.js.map