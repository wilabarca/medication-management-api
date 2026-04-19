import mysql from "mysql2/promise";
import crypto from "crypto";
import { User } from "../../Domain/Entities/User";
import { UserRepository } from "../../Domain/Repositories/UserRepository";

export class MySQLUserRepository implements UserRepository {
  constructor(private db: mysql.Pool) {}

  async create(user: User): Promise<User> {
    const id = crypto.randomUUID();

    await this.db.execute(
      `INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [id, user.name, user.email, user.password, user.role]
    );

    return { ...user, id };
  }

  async getById(id: string): Promise<User | null> {
    const [rows] = await this.db.execute<any[]>(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );

    return rows[0] || null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const [rows] = await this.db.execute<any[]>(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    return rows[0] || null;
  }

  async getAll(): Promise<User[]> {
    const [rows] = await this.db.execute<any[]>(`SELECT * FROM users`);
    return rows;
  }

  async update(user: User): Promise<User> {
    await this.db.execute(
      `UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?`,
      [user.name, user.email, user.password, user.role, user.id]
    );

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.db.execute(`DELETE FROM users WHERE id = ?`, [id]);
  }
}