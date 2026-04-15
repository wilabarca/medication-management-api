import { Request, Response } from "express";
import { MedicationService } from "../../Application/Medicationservices";
import { Medication } from "../../Domain/Entities/Medication";

export class MedicineController {
  constructor(private service: MedicationService) {}

  async createMedicine(req: Request, res: Response): Promise<Response> {
    try {
      const {
        userId,
        name,
        dosage,
        form,
        instructions,
        notes,
        quantity,
        price,
        isActive
      } = req.body;

      if (!userId || !name || !dosage || !form || quantity === undefined) {
        return res.status(400).json({
          error: "userId, name, dosage, form y quantity son requeridos"
        });
      }

      const medication: Medication = {
        id: '',
        userId,
        name,
        dosage,
        form,
        instructions,
        notes,
        quantity,
        price,
        isActive: isActive ?? true
      };

      const createdMedication = await this.service.createMedication(medication);

      return res.status(201).json({
        mensaje: "Medicamento agregado al tratamiento exitosamente",
        data: createdMedication
      });

    } catch (error) {
      return res.status(500).json({
        error: "Error al crear medicamento"
      });
    }
  }

  async getAllMedicines(_req: Request, res: Response): Promise<Response> {
    try {
      const medicines = await this.service.getAllMedications();
      return res.json(medicines);

    } catch (error) {
      return res.status(500).json({
        error: "Error al obtener medicamentos"
      });
    }
  }

  async getMedicineById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const medicine = await this.service.getMedicationById(id);

      if (!medicine) {
        return res.status(404).json({
          error: "Medicamento no encontrado"
        });
      }

      return res.json(medicine);

    } catch (error) {
      return res.status(500).json({
        error: "Error al obtener medicamento"
      });
    }
  }

  async updateMedicine(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      const {
        userId,
        name,
        dosage,
        form,
        instructions,
        notes,
        quantity,
        price,
        isActive
      } = req.body;

      if (!userId || !name || !dosage || !form || quantity === undefined) {
        return res.status(400).json({
          error: "userId, name, dosage, form y quantity son requeridos"
        });
      }

      const updated: Medication = {
        id,
        userId,
        name,
        dosage,
        form,
        instructions,
        notes,
        quantity,
        price,
        isActive: isActive ?? true
      };

      const updatedMedication = await this.service.updateMedication(updated);

      return res.json({
        mensaje: "Medicamento actualizado exitosamente",
        data: updatedMedication
      });

    } catch (error) {
      return res.status(500).json({
        error: "Error al actualizar medicamento"
      });
    }
  }

  async deleteMedicine(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;

      await this.service.deleteMedication(id);

      return res.json({
        mensaje: "Medicamento eliminado exitosamente"
      });

    } catch (error) {
      return res.status(500).json({
        error: "Error al eliminar medicamento"
      });
    }
  }
}