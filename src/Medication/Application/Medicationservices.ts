import { Medication } from '../Domain/Entities/Medication';
import { MedicationRepository } from '../Domain/Repositories/MedicationRepository';
import { sendMedicationNotificationToTokens } from '../../Core/firebase/MedicationNotifications';
import { UserDeviceRepository } from '../../Devises/domain/Repositories/UserDeviceRepository';

export class MedicationService {
  constructor(
    private repository: MedicationRepository,
    private userDeviceRepository: UserDeviceRepository
  ) {}

  async createMedication(medication: Medication, deviceId: string) {
    const createdMedication = await this.repository.create(medication);

    try {
      const tokens =
        await this.userDeviceRepository.getTokensByUserIdExcludingDevice(
          createdMedication.userId,
          deviceId
        );

      await sendMedicationNotificationToTokens(
        createdMedication,
        tokens,
        'medication_created_remote'
      );
    } catch (error) {
      console.error('❌ Error enviando FCM create:', error);
    }

    return createdMedication;
  }

  getMedicationById(id: string) {
    return this.repository.getById(id);
  }

  getAllMedications() {
    return this.repository.getAll();
  }

  async updateMedication(medication: Medication, deviceId: string) {
    const updatedMedication = await this.repository.update(medication);

    try {
      const tokens =
        await this.userDeviceRepository.getTokensByUserIdExcludingDevice(
          updatedMedication.userId,
          deviceId
        );

      await sendMedicationNotificationToTokens(
        updatedMedication,
        tokens,
        'medication_updated_remote'
      );
    } catch (error) {
      console.error('❌ Error enviando FCM update:', error);
    }

    return updatedMedication;
  }

  deleteMedication(id: string) {
    return this.repository.delete(id);
  }
}