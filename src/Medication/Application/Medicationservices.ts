import { Medication } from '../Domain/Entities/Medication';
import { MedicationRepository } from '../Domain/Repositories/MedicationRepository';

export class MedicationService {
  private repository: MedicationRepository;

  constructor(repository: MedicationRepository) {
    this.repository = repository;
  }

  async createMedication(medication: Medication): Promise<Medication> {
    return this.repository.create(medication);
  }

  async getMedicationById(id: string): Promise<Medication | null> {
    return this.repository.getById(id);
  }

  async updateMedication(medication: Medication): Promise<Medication> {
    return this.repository.update(medication);
  }

  async deleteMedication(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getAllMedications(): Promise<Medication[]> {
    return this.repository.getAll();
  }
}