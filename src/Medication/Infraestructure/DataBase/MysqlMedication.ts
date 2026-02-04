import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { Medication } from '../../Domain/Entities/Medication';
import { MedicationRepository } from '../../Domain/Repositories/MedicationRepository';

export class MySQLMedicationRepository implements MedicationRepository {
  constructor(private db: mysql.Connection) {}

  // ➕ Crear medicamento
  async create(medication: Medication): Promise<Medication> {
    const id = uuidv4();

    await this.db.execute(
      `INSERT INTO medications (id, name, description, quantity, price, expiration_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        medication.name,
        medication.description,
        medication.quantity,
        medication.price,
        medication.expirationDate
      ]
    );

    return {
      ...medication,
      id
    };
  }

  // 🔍 Obtener medicamento por ID
  async getById(id: string): Promise<Medication | null> {
    const [rows] = await this.db.execute<mysql.RowDataPacket[]>(
      `SELECT id, name, description, quantity, price, expiration_date 
       FROM medications WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0] as mysql.RowDataPacket;
    return {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string,
      quantity: row.quantity as number,
      price: row.price as number,
      expirationDate: new Date(row.expiration_date as string)
    };
  }

  // 📋 Obtener todos los medicamentos
  async getAll(): Promise<Medication[]> {
    const [rows] = await this.db.execute<mysql.RowDataPacket[]>(
      `SELECT id, name, description, quantity, price, expiration_date 
       FROM medications ORDER BY name ASC`
    );

    return rows.map((row: mysql.RowDataPacket) => ({
      id: row.id as string,
      name: row.name as string,
      description: row.description as string,
      quantity: row.quantity as number,
      price: row.price as number,
      expirationDate: new Date(row.expiration_date as string)
    }));
  }

  // ✏️ Actualizar medicamento
  async update(medication: Medication): Promise<Medication> {
    await this.db.execute(
      `UPDATE medications 
       SET name = ?, description = ?, quantity = ?, price = ?, expiration_date = ? 
       WHERE id = ?`,
      [
        medication.name,
        medication.description,
        medication.quantity,
        medication.price,
        medication.expirationDate,
        medication.id
      ]
    );

    return medication;
  }

  // 🗑️ Eliminar medicamento
  async delete(id: string): Promise<void> {
    await this.db.execute(
      `DELETE FROM medications WHERE id = ?`,
      [id]
    );
  }
}