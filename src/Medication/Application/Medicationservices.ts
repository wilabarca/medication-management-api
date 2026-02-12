import { Medication } from '../Domain/Entities/Medication';
import { MedicationRepository } from '../Domain/Repositories/MedicationRepository';

export class MedicationService {
  constructor(private repository: MedicationRepository) {}

  createMedication(medication: Medication) {
    return this.repository.create(medication);
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
