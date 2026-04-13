import { Medication } from '../Domain/Entities/Medication';
import { MedicationRepository } from '../Domain/Repositories/MedicationRepository';
import { sendMedicationCreatedNotification } from '../../Core/firebase/MedicationNotifications';

export class MedicationService {
  constructor(private repository: MedicationRepository) {}

  async createMedication(medication: Medication) {
    const createdMedication = await this.repository.create(medication);

    try {
      const messageId = await sendMedicationCreatedNotification(createdMedication);
      console.log('✅ FCM enviado:', messageId);
    } catch (error) {
      console.error('❌ Error enviando FCM:', error);
    }

    return createdMedication;
  }

  getMedicationById(id: string) {
    return this.repository.getById(id);
  }

  getAllMedications() {
    return this.repository.getAll();
  }

  updateMedication(medication: Medication) {
    return this.repository.update(medication);
  }

  deleteMedication(id: string) {
    return this.repository.delete(id);
  }
}