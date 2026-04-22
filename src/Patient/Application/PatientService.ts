import { Patient } from "../Domain/Entities/patient";
import { PatientRepository } from "../Domain/Repositories/PatientRepository";

export class PatientService {
  constructor(private repository: PatientRepository) {}

  async createPatient(patient: Patient): Promise<Patient> {
    return this.repository.create(patient);
  }

  async getPatientById(id: string): Promise<Patient | null> {
    return this.repository.getById(id);
  }

  async getPatientsByCaregiverUserId(caregiverUserId: string): Promise<Patient[]> {
    return this.repository.getByCaregiverUserId(caregiverUserId);
  }

  async updatePatient(patient: Patient): Promise<Patient> {
    return this.repository.update(patient);
  }

  async deletePatient(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}