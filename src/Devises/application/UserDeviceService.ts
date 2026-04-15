import { UserDevice } from "../domain/Entities/UserDevice";
import { UserDeviceRepository } from "../domain/Repositories/UserDeviceRepository";

export class UserDeviceService {
  constructor(private repository: UserDeviceRepository) {}

  async registerDevice(device: UserDevice): Promise<void> {
    await this.repository.registerDevice(device);
  }

  async getTokensByUserId(userId: string): Promise<string[]> {
    return this.repository.getTokensByUserId(userId);
  }

  async getTokensByUserIdExcludingDevice(userId: string, deviceId: string): Promise<string[]> {
    return this.repository.getTokensByUserIdExcludingDevice(userId, deviceId);
  }
}