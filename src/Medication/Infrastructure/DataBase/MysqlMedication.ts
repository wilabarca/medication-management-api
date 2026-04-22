import mysql from "mysql2/promise";
import crypto from "crypto";
import { Medication } from "../../Domain/Entities/Medication";
import { MedicationRepository } from "../../Domain/Repositories/MedicationRepository";

export class MySQLMedicationRepository implements MedicationRepository {
  constructor(private db: mysql.Pool) {}

  private mapRowToMedication(row: any): Medication {
    return {
      id: row.id,
      patientId: row.patient_id,
      name: row.name,
      dosage: row.dosage,
      form: row.form,
      instructions: row.instructions,
      notes: row.notes,
      quantity: row.quantity,
      price: row.price,
      isActive: Boolean(row.is_active),
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
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      ]
    );

    return { ...medication, id };
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
    const [rows] = await this.db.execute<any[]>(
      `SELECT * FROM medications`
    );

    return rows.map((row) => this.mapRowToMedication(row));
  }

  async getByPatientId(patientId: string): Promise<Medication[]> {
    const [rows] = await this.db.execute<any[]>(
      `SELECT * FROM medications WHERE patient_id = ?`,
      [patientId]
    );

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
        is_active = ?
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
        medication.id,
      ]
    );

    return medication;
  }

  async delete(id: string): Promise<void> {
    await this.db.execute(
      `DELETE FROM medications WHERE id = ?`,
      [id]
    );
  }
}