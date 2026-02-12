import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { Medication } from '../../Domain/Entities/Medication';
import { MedicationRepository } from '../../Domain/Repositories/MedicationRepository';

export class MySQLMedicationRepository implements MedicationRepository {
  constructor(private db: mysql.Pool) {}

  async create(medication: Medication): Promise<Medication> {
    const id = uuidv4();

    await this.db.execute(
      `INSERT INTO medications (id,name,description,quantity,price) VALUES (?,?,?,?,?)`,
      [
        id,
        medication.name,
        medication.description,
        medication.quantity,
        medication.price
      ]
    );

    return { ...medication, id };
  }

  async getById(id: string): Promise<Medication | null> {
    const [rows] = await this.db.execute<any[]>(
      `SELECT * FROM medications WHERE id=?`,
      [id]
    );

    return rows[0] || null;
  }

  async getAll(): Promise<Medication[]> {
    const [rows] = await this.db.execute<any[]>(`SELECT * FROM medications`);
    return rows;
  }

  async update(medication: Medication): Promise<Medication> {
    await this.db.execute(
      `UPDATE medications SET name=?,description=?,quantity=?,price=? WHERE id=?`,
      [
        medication.name,
        medication.description,
        medication.quantity,
        medication.price,
        medication.id
      ]
    );

    return medication;
  }

  async delete(id: string): Promise<void> {
    await this.db.execute(`DELETE FROM medications WHERE id=?`, [id]);
  }
}
