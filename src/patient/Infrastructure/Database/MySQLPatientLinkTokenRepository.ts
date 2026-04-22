import mysql from "mysql2/promise";
import crypto from "crypto";
import { PatientLinkToken } from "../../Domain/Entities/PatientLinkToken";
import { PatientLinkTokenRepository } from "../../Domain/Repositories/PatientLinkTokenRepository";

export class MySQLPatientLinkTokenRepository implements PatientLinkTokenRepository {
  constructor(private db: mysql.Pool) {}

  private mapRow(row: any): PatientLinkToken {
    return {
      id: row.id,
      patientId: row.patient_id,
      token: row.token,
      expiresAt: row.expires_at,
      usedAt: row.used_at,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
    };
  }

  async create(linkToken: PatientLinkToken): Promise<PatientLinkToken> {
    const id = crypto.randomUUID();

    await this.db.execute(
      `
      INSERT INTO patient_link_tokens (
        id,
        patient_id,
        token,
        expires_at,
        used_at,
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        linkToken.patientId,
        linkToken.token,
        linkToken.expiresAt,
        linkToken.usedAt ?? null,
        linkToken.isActive,
      ]
    );

    return { ...linkToken, id };
  }

  async findActiveByToken(token: string): Promise<PatientLinkToken | null> {
    const [rows] = await this.db.execute<any[]>(
      `
      SELECT * FROM patient_link_tokens
      WHERE token = ?
        AND is_active = 1
        AND used_at IS NULL
      LIMIT 1
      `,
      [token]
    );

    if (!rows.length) return null;
    return this.mapRow(rows[0]);
  }

  async deactivateTokensByPatientId(patientId: string): Promise<void> {
    await this.db.execute(
      `
      UPDATE patient_link_tokens
      SET is_active = 0
      WHERE patient_id = ?
        AND used_at IS NULL
        AND is_active = 1
      `,
      [patientId]
    );
  }

  async markAsUsed(id: string): Promise<void> {
    await this.db.execute(
      `
      UPDATE patient_link_tokens
      SET used_at = CURRENT_TIMESTAMP,
          is_active = 0
      WHERE id = ?
      `,
      [id]
    );
  }
}