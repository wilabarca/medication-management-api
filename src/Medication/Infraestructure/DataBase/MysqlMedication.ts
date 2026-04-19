import mysql from 'mysql2/promise';
import crypto from 'crypto';
import { Medication } from '../../Domain/Entities/Medication';
import { MedicationRepository } from '../../Domain/Repositories/MedicationRepository';

export class MySQLMedicationRepository implements MedicationRepository {
  constructor(private db: mysql.Pool) {}

  private mapRowToMedication(row: any): Medication {
    return {
      id: row.id,
      patientId: row.patient_id,
      name: row.name,
      dosage: row.dosage,
      form: row.form,
      instructions: row.instructions ?? undefined,
      notes: row.notes ?? undefined,
      quantity: Number(row.quantity ?? 0),
      price:
        row.price !== null && row.price !== undefined
          ? Number(row.price)
          : undefined,
      isActive: Boolean(row.is_active),
      startDate: row.start_date ?? null,
      endDate: row.end_date ?? null,
    };
  }

  async create(medication: Medication): Promise<Medication> {
    const id = crypto.randomUUID();

    await this.db.execute(
      `
      INSERT INTO medications (
        id,
        patient_id,
        name,
        dosage,
        form,
        instructions,
        notes,
        quantity,
        price,
        is_active,
        start_date,
        end_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        medication.patientId,
        medication.name,
        medication.dosage,
        medication.form,
        medication.instructions ?? null,
        medication.notes ?? null,
        medication.quantity,
        medication.price ?? null,
        medication.isActive,
        medication.startDate ?? null,
        medication.endDate ?? null,
      ]
    );

    return {
      ...medication,
      id
    };
  }

  async getById(id: string): Promise<Medication | null> {
    const [rows] = await this.db.execute<any[]>(
      `SELECT * FROM medications WHERE id = ?`,
      [id]
    );

    if (!rows.length) return null;

    return this.mapRowToMedication(rows[0]);
  }

  async getAll(): Promise<Medication[]> {
    const [rows] = await this.db.execute<any[]>(`SELECT * FROM medications`);
    return rows.map((row) => this.mapRowToMedication(row));
  }

  async update(medication: Medication): Promise<Medication> {
    await this.db.execute(
      `
      UPDATE medications
      SET
        patient_id = ?,
        name = ?,
        dosage = ?,
        form = ?,
        instructions = ?,
        notes = ?,
        quantity = ?,
        price = ?,
        is_active = ?,
        start_date = ?,
        end_date = ?
      WHERE id = ?
      `,
      [
        medication.patientId,
        medication.name,
        medication.dosage,
        medication.form,
        medication.instructions ?? null,
        medication.notes ?? null,
        medication.quantity,
        medication.price ?? null,
        medication.isActive,
        medication.startDate ?? null,
        medication.endDate ?? null,
        medication.id
      ]
    );

    return medication;
  }

  async delete(id: string): Promise<void> {
    await this.db.execute(`DELETE FROM medications WHERE id = ?`, [id]);
  }
}