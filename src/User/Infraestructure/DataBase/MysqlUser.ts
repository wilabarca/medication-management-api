import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../Domain/Entities/User';
import { UserRepository } from '../../Domain/Repositories/UserRepository';

export class MySQLUserRepository implements UserRepository {
  constructor(private db: mysql.Connection) {}

  // ➕ Crear usuario
  async create(user: User): Promise<User> {
    const id = uuidv4();

    await this.db.execute(
      `INSERT INTO users (id, name, email, password) 
       VALUES (?, ?, ?, ?)`,
      [id, user.name, user.email, user.password]
    );

    return {
      ...user,
      id
    };
  }

  // 🔍 Obtener usuario por ID
  async getById(id: string): Promise<User | null> {
    const [rows] = await this.db.execute<mysql.RowDataPacket[]>(
      `SELECT id, name, email, password 
       FROM users WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0] as mysql.RowDataPacket;
    return {
      id: row.id as string,
      name: row.name as string,
      email: row.email as string,
      password: row.password as string
    };
  }

  // 📋 Obtener todos los usuarios
  async getAll(): Promise<User[]> {
    const [rows] = await this.db.execute<mysql.RowDataPacket[]>(
      `SELECT id, name, email, password 
       FROM users ORDER BY name ASC`
    );

    return rows.map((row: mysql.RowDataPacket) => ({
      id: row.id as string,
      name: row.name as string,
      email: row.email as string,
      password: row.password as string
    }));
  }

  // ✏️ Actualizar usuario
  async update(user: User): Promise<User> {
    await this.db.execute(
      `UPDATE users 
       SET name = ?, email = ?, password = ? 
       WHERE id = ?`,
      [user.name, user.email, user.password, user.id]
    );

    return user;
  }

  // 🗑️ Eliminar usuario
  async delete(id: string): Promise<void> {
    await this.db.execute(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );
  }
}