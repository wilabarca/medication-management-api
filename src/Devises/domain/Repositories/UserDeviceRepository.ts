import { UserDevice } from "../Entities/UserDevice";

export interface UserDeviceRepository {
  registerDevice(device: UserDevice): Promise<void>;
  getTokensByUserId(userId: string): Promise<string[]>;
  getTokensByUserIdExcludingDevice(userId: string, deviceId: string): Promise<string[]>;
}