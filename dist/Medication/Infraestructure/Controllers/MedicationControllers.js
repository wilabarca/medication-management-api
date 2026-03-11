"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicineController = void 0;
class MedicineController {
    constructor(service) {
        this.service = service;
    }
    async createMedicine(req, res) {
        const { name, description, quantity, price } = req.body;
        if (!name || !description || quantity === undefined || price === undefined) {
            return res.status(400).json({ error: "Todos los campos son requeridos" });
        }
        const medication = {
            id: '',
            name,
            description,
            quantity,
            price
        };
        await this.service.createMedication(medication);
        res.status(201).json({ mensaje: "Medicamento creado exitosamente" });
    }
    async getAllMedicines(req, res) {
        const medicines = await this.service.getAllMedications();
        res.json(medicines);
    }
    async getMedicineById(req, res) {
        const id = req.params.id;
        const medicine = await this.service.getMedicationById(id);
        if (!medicine) {
            return res.status(404).json({ error: "Medicamento no encontrado" });
        }
        res.json(medicine);
    }
    async updateMedicine(req, res) {
        const id = req.params.id;
        const { name, description, quantity, price } = req.body;
        const updated = {
            id,
            name,
            description,
            quantity,
            price
        };
        await this.service.updateMedication(updated);
        res.json({ mensaje: "Medicamento actualizado exitosamente" });
    }
    async deleteMedicine(req, res) {
        const id = req.params.id;
        await this.service.deleteMedication(id);
        res.json({ mensaje: "Medicamento eliminado exitosamente" });
    }
}
exports.MedicineController = MedicineController;
//# sourceMappingURL=MedicationControllers.js.map