import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../Domain/Entities/User';
import { UserRepository } from '../../Domain/Repositories/UserRepository';

export class MySQLUserRepository implements UserRepository {
  constructor(private db: mysql.Pool) {}

  async create(user: User): Promise<User> {
    const id = uuidv4();

    await this.db.execute(
      `INSERT INTO users (id,name,email,password) VALUES (?,?,?,?)`,
      [id, user.name, user.email, user.password]
    );

    return { ...user, id };
  }

  async getById(id: string): Promise<User | null> {
    const [rows] = await this.db.execute<any[]>(
      `SELECT * FROM users WHERE id=?`,
      [id]
    );

    return rows[0] || null;
  }

  async getAll(): Promise<User[]> {
    const [rows] = await this.db.execute<any[]>(`SELECT * FROM users`);
    return rows;
  }

  async update(user: User): Promise<User> {
    await this.db.execute(
      `UPDATE users SET name=?,email=?,password=? WHERE id=?`,
      [user.name, user.email, user.password, user.id]
    );

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.db.execute(`DELETE FROM users WHERE id=?`, [id]);
  }
}
