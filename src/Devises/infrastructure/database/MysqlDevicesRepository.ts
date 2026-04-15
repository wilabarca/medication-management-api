import mysql from "mysql2/promise";
import crypto from "crypto";
import { UserDevice } from "../../domain/Entities/UserDevice";
import { UserDeviceRepository } from "../../domain/Repositories/UserDeviceRepository";

export class MySQLUserDeviceRepository implements UserDeviceRepository {
  constructor(private db: mysql.Pool) {}

  async registerDevice(device: UserDevice): Promise<void> {
    const id = crypto.randomUUID();

    await this.db.execute(
      `
      INSERT INTO user_devices (id, user_id, device_id, fcm_token)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        fcm_token = VALUES(fcm_token),
        updated_at = CURRENT_TIMESTAMP
      `,
      [id, device.userId, device.deviceId, device.fcmToken]
    );
  }

  async getTokensByUserId(userId: string): Promise<string[]> {
    const [rows] = await this.db.execute<any[]>(
      `SELECT fcm_token FROM user_devices WHERE user_id = ?`,
      [userId]
    );

    return rows.map((row) => row.fcm_token).filter(Boolean);
  }

  async getTokensByUserIdExcludingDevice(userId: string, deviceId: string): Promise<string[]> {
    const [rows] = await this.db.execute<any[]>(
      `
      SELECT fcm_token
      FROM user_devices
      WHERE user_id = ? AND device_id <> ?
      `,
      [userId, deviceId]
    );

    return rows.map((row) => row.fcm_token).filter(Boolean);
  }
}