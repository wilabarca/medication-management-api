import { PatientLinkToken } from "../Entities/PatientLinkToken";

export interface PatientLinkTokenRepository {
  create(linkToken: PatientLinkToken): Promise<PatientLinkToken>;
  findActiveByToken(token: string): Promise<PatientLinkToken | null>;
  deactivateTokensByPatientId(patientId: string): Promise<void>;
  markAsUsed(id: string): Promise<void>;
}