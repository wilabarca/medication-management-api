import { Request, Response } from "express";
import { MedicationService } from "../../Application/Medicationservices";
import { Medication } from "../../Domain/Entities/Medication";

export class MedicineController {

  constructor(private service: MedicationService) {}

  async createMedicine(req: Request, res: Response) {
    const { name, description, quantity, price } = req.body;

    if (!name || !description || quantity === undefined || price === undefined) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const medication: Medication = {
      id: '',
      name,
      description,
      quantity,
      price
    };

    await this.service.createMedication(medication);

    res.status(201).json({ mensaje: "Medicamento creado exitosamente" });
  }

  async getAllMedicines(req: Request, res: Response) {
    const medicines = await this.service.getAllMedications();
    res.json(medicines);
  }

  async getMedicineById(req: Request, res: Response) {
    const id = req.params.id as string;

    const medicine = await this.service.getMedicationById(id);

    if (!medicine) {
      return res.status(404).json({ error: "Medicamento no encontrado" });
    }

    res.json(medicine);
  }

  async updateMedicine(req: Request, res: Response) {
    const id = req.params.id as string;
    const { name, description, quantity, price } = req.body;

    const updated: Medication = {
      id,
      name,
      description,
      quantity,
      price
    };

    await this.service.updateMedication(updated);

    res.json({ mensaje: "Medicamento actualizado exitosamente" });
  }

  async deleteMedicine(req: Request, res: Response) {
    const id = req.params.id as string;

    await this.service.deleteMedication(id);

    res.json({ mensaje: "Medicamento eliminado exitosamente" });
  }
}
