import { Request, Response } from "express";
import { PatientService } from "../../Application/PatientService";
import { Patient } from "../../Domain/Entities/patient";

export class PatientController {
    constructor(private service: PatientService) {}

    async createPatient(req: Request, res: Response): Promise<Response> {
        try {
        const {
            caregiverUserId,
            linkedUserId,
            name,
            birthDate,
            relationship,
            notes,
            isActive,
        } = req.body;

    if (!caregiverUserId || !name) {
        return res.status(400).json({
            message: "caregiverUserId y name son requeridos",
            });
        }

    const patient: Patient = {
        id: "",
        caregiverUserId,
        linkedUserId: linkedUserId ?? null,
        name,
        birthDate: birthDate ?? null,
        relationship: relationship ?? null,
        notes: notes ?? null,
        isActive: isActive ?? true,
    };

    const newPatient = await this.service.createPatient(patient);

        return res.status(201).json(newPatient);
    } catch (error) {
        return res.status(500).json({
        message: "Error al crear paciente",
    });
    }
}

    async getPatientById(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;
        const patient = await this.service.getPatientById(id);

    if (!patient) {
        return res.status(404).json({
            message: "Paciente no encontrado",
        });
    }

        return res.json(patient);
    } catch (error) {
        return res.status(500).json({
        message: "Error al obtener paciente",
        });
    }
}

    async getPatientsByCaregiver(req: Request, res: Response): Promise<Response> {
    try {
        const { caregiverUserId } = req.params;
        const patients = await this.service.getPatientsByCaregiverUserId(caregiverUserId);
        return res.json(patients);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener pacientes",
    });
    }
}

    async updatePatient(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;
        const {
            caregiverUserId,
            linkedUserId,
            name,
            birthDate,
            relationship,
            notes,
            isActive,
        } = req.body;

        const patient: Patient = {
            id,
            caregiverUserId,
            linkedUserId: linkedUserId ?? null,
            name,
            birthDate: birthDate ?? null,
            relationship: relationship ?? null,
            notes: notes ?? null,
            isActive: isActive ?? true,
        };

        const updatedPatient = await this.service.updatePatient(patient);
        return res.json(updatedPatient);
    } catch (error) {
        return res.status(500).json({
        message: "Error al actualizar paciente",
        });
    }
}

    async deletePatient(req: Request, res: Response): Promise<Response> {
    try {
        const { id } = req.params;
        await this.service.deletePatient(id);

        return res.json({
        message: "Paciente eliminado",
    });
    } catch (error) {
        return res.status(500).json({
        message: "Error al eliminar paciente",
        });
    }
    }
}