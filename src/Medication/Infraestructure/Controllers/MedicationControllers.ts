import { Request, Response } from "express";
import { MedicationService } from "../../Application/Medicationservices";
import { Medication } from "../../Domain/Entities/Medication";

export class MedicineController {
  constructor(private service: MedicationService) {}

  async createMedicine(req: Request, res: Response): Promise<Response> {
    try {
      const {
        patientId,
        name,
        dosage,
        form,
        instructions,
        notes,
        quantity,
        price,
        isActive,
      } = req.body;

      if (!patientId || !name || !dosage || !form || quantity === undefined) {
        return res.status(400).json({
          message: "patientId, name, dosage, form y quantity son requeridos",
        });
      }

      const medication: Medication = {
        id: "",
        patientId,
        name,
        dosage,
        form,
        instructions: instructions ?? null,
        notes: notes ?? null,
        quantity,
        price: price ?? null,
        isActive: isActive ?? true,
      };

      const newMedication = await this.service.createMedication(medication);
      return res.status(201).json(newMedication);
    } catch (error) {
      return res.status(500).json({
        message: "Error al crear medicamento",
      });
    }
  }

  async getMedicationById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const medication = await this.service.getMedicationById(id);

      if (!medication) {
        return res.status(404).json({
          message: "Medicamento no encontrado",
        });
      }

      return res.json(medication);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener medicamento",
      });
    }
  }

  async getAllMedicines(_req: Request, res: Response): Promise<Response> {
    try {
      const medications = await this.service.getAllMedications();
      return res.json(medications);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener medicamentos",
      });
    }
  }

  async getMedicinesByPatient(req: Request, res: Response): Promise<Response> {
    try {
      const { patientId } = req.params;

      if (!patientId) {
        return res.status(400).json({
          message: "patientId es requerido",
        });
      }

      const medications = await this.service.getMedicationsByPatientId(patientId);
      return res.json(medications);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener medicamentos del paciente",
      });
    }
  }

  async updateMedicine(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const {
        patientId,
        name,
        dosage,
        form,
        instructions,
        notes,
        quantity,
        price,
        isActive,
      } = req.body;

      const medication: Medication = {
        id,
        patientId,
        name,
        dosage,
        form,
        instructions: instructions ?? null,
        notes: notes ?? null,
        quantity,
        price: price ?? null,
        isActive: isActive ?? true,
      };

      const updatedMedication = await this.service.updateMedication(medication);
      return res.json(updatedMedication);
    } catch (error) {
      return res.status(500).json({
        message: "Error al actualizar medicamento",
      });
    }
  }

  async deleteMedicine(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.service.deleteMedication(id);

      return res.json({
        message: "Medicamento eliminado",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error al eliminar medicamento",
      });
    }
  }
}