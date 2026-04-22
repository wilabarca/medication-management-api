import { Patient } from "../Entities/patient";

export interface PatientRepository {
  create(patient: Patient): Promise<Patient>;
  getById(id: string): Promise<Patient | null>;
  getByCaregiverUserId(caregiverUserId: string): Promise<Patient[]>;
  update(patient: Patient): Promise<Patient>;
  delete(id: string): Promise<void>;
  linkUserToPatient(patientId: string, userId: string): Promise<void>;
}