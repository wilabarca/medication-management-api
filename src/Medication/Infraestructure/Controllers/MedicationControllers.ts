import { Request, Response } from "express";
import { Medication } from "../../Domain/Entities/Medication";
import { MedicationService } from "../../Application/Medicationservices";

export class MedicineController {

  constructor(private service: MedicationService) {}

  // ➕ Crear medicamento
  async createMedicine(req: Request, res: Response) {
    const { name, description, quantity, price, expirationDate } = req.body;

    if (!name || !description || quantity === undefined || price === undefined || !expirationDate) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const medication: Medication = {
      id: '', // El repositorio asignará el ID
      name,
      description,
      quantity,
      price,
      expirationDate: new Date(expirationDate)
    };

    await this.service.createMedication(medication);

    res.status(201).json({ mensaje: "Medicamento creado exitosamente" });
  }

  // 📋 Obtener todos los medicamentos
  async getAllMedicines(req: Request, res: Response) {
    const medicines = await this.service.getAllMedications();
    res.json(medicines);
  }

  // 🔍 Obtener medicamento por ID
  async getMedicineById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID requerido" });
    }

    const medicine = await this.service.getMedicationById(id);

    if (!medicine) {
      return res.status(404).json({ error: "Medicamento no encontrado" });
    }

    res.json(medicine);
  }

  // ✏️ Actualizar medicamento
  async updateMedicine(req: Request, res: Response) {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "ID requerido" });
    }

    const { name, description, quantity, price, expirationDate } = req.body;
    
    const updated: Medication = {
      id,
      name,
      description,
      quantity,
      price,
      expirationDate: new Date(expirationDate)
    };

    try {
      await this.service.updateMedication(updated);
      res.json({ mensaje: "Medicamento actualizado exitosamente" });
    } catch {
      res.status(404).json({ error: "Medicamento no encontrado" });
    }
  }

  // 🗑️ Eliminar medicamento
  async deleteMedicine(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID requerido" });
    }

    try {
      await this.service.deleteMedication(id);
      res.json({ mensaje: "Medicamento eliminado exitosamente" });
    } catch {
      res.status(404).json({ error: "Medicamento no encontrado" });
    }
  }
}