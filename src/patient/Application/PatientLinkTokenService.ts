import crypto from "crypto";
import { PatientRepository } from "../Domain/Repositories/PatientRepository";
import { PatientLinkTokenRepository } from "../Domain/Repositories/PatientLinkTokenRepository";
import { PatientLinkToken } from "../Domain/Entities/PatientLinkToken";

export class PatientLinkTokenService {
  constructor(
    private patientRepository: PatientRepository,
    private tokenRepository: PatientLinkTokenRepository
  ) {}

  async generateToken(
    patientId: string,
    caregiverUserId: string
  ): Promise<{ token: string; expiresAt: string }> {
    const patient = await this.patientRepository.getById(patientId);

    if (!patient) {
      throw new Error("Paciente no encontrado");
    }

    if (patient.caregiverUserId !== caregiverUserId) {
      throw new Error("No autorizado para generar token de este paciente");
    }

    await this.tokenRepository.deactivateTokensByPatientId(patientId);

    const token = crypto.randomBytes(4).toString("hex").toUpperCase();
    const expiresAtDate = new Date(Date.now() + 1000 * 60 * 30);
    const expiresAt = expiresAtDate.toISOString().slice(0, 19).replace("T", " ");

    const entity: PatientLinkToken = {
      id: "",
      patientId,
      token,
      expiresAt,
      usedAt: null,
      isActive: true,
    };

    await this.tokenRepository.create(entity);

    return {
      token,
      expiresAt: expiresAtDate.toISOString(),
    };
  }

  async consumeToken(
    token: string,
    userId: string
  ): Promise<{ message: string; patientId: string }> {
    const linkToken = await this.tokenRepository.findActiveByToken(token);

    if (!linkToken) {
      throw new Error("Token inválido o inactivo");
    }

    const expiresAt = new Date(linkToken.expiresAt).getTime();
    const now = Date.now();

    if (now > expiresAt) {
      await this.tokenRepository.markAsUsed(linkToken.id);
      throw new Error("Token expirado");
    }

    const patient = await this.patientRepository.getById(linkToken.patientId);

    if (!patient) {
      throw new Error("Paciente no encontrado");
    }

    if (patient.linkedUserId && patient.linkedUserId !== userId) {
      throw new Error("Este paciente ya está vinculado a otra cuenta");
    }

    await this.patientRepository.linkUserToPatient(patient.id, userId);
    await this.tokenRepository.markAsUsed(linkToken.id);

    return {
      message: "Cuenta vinculada correctamente",
      patientId: patient.id,
    };
  }
}