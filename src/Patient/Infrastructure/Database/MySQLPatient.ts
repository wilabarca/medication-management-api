import mysql from "mysql2/promise";
import crypto from "crypto";
import { Patient } from "../../Domain/Entities/patient";
import { PatientRepository } from "../../Domain/Repositories/PatientRepository";

export class MySQLPatientRepository implements PatientRepository {
  constructor(private db: mysql.Pool) {}

  private mapRowToPatient(row: any): Patient {
    return {
      id: row.id,
      caregiverUserId: row.caregiver_user_id,
      linkedUserId: row.linked_user_id,
      name: row.name,
      birthDate: row.birth_date,
      relationship: row.relationship,
      notes: row.notes,
      isActive: Boolean(row.is_active),
    };
  }

  async linkUserToPatient(patientId: string, userId: string): Promise<void> {
  await this.db.execute(
    `
    UPDATE patients
    SET linked_user_id = ?
    WHERE id = ?
    `,
    [userId, patientId]
  );
}

  async create(patient: Patient): Promise<Patient> {
    const id = crypto.randomUUID();

    await this.db.execute(
      `
      INSERT INTO patients (
        id,
        caregiver_user_id,
        linked_user_id,
        name,
        birth_date,
        relationship,
        notes,
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        patient.caregiverUserId,
        patient.linkedUserId ?? null,
        patient.name,
        patient.birthDate ?? null,
        patient.relationship ?? null,
        patient.notes ?? null,
        patient.isActive,
      ]
    );

    return { ...patient, id };
  }

  async getById(id: string): Promise<Patient | null> {
    const [rows] = await this.db.execute<any[]>(
      `SELECT * FROM patients WHERE id = ?`,
      [id]
    );

    if (!rows.length) return null;
    return this.mapRowToPatient(rows[0]);
  }

  async getByCaregiverUserId(caregiverUserId: string): Promise<Patient[]> {
    const [rows] = await this.db.execute<any[]>(
      `SELECT * FROM patients WHERE caregiver_user_id = ?`,
      [caregiverUserId]
    );

    return rows.map((row) => this.mapRowToPatient(row));
  }

  async update(patient: Patient): Promise<Patient> {
    await this.db.execute(
      `
      UPDATE patients
      SET
        caregiver_user_id = ?,
        linked_user_id = ?,
        name = ?,
        birth_date = ?,
        relationship = ?,
        notes = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        patient.caregiverUserId,
        patient.linkedUserId ?? null,
        patient.name,
        patient.birthDate ?? null,
        patient.relationship ?? null,
        patient.notes ?? null,
        patient.isActive,
        patient.id,
      ]
    );

    return patient;
  }

  async delete(id: string): Promise<void> {
    await this.db.execute(`DELETE FROM patients WHERE id = ?`, [id]);
  }
}