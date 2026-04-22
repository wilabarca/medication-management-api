export interface PatientLinkToken {

  id: string;
  patientId: string;
  token: string;
  expiresAt: string;
  usedAt?: string | null;
  isActive: boolean;
  createdAt?: string;

}