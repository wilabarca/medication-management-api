"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationService = void 0;
class MedicationService {
    constructor(repository) {
        this.repository = repository;
    }
    createMedication(medication) {
        return this.repository.create(medication);
    }
    getMedicationById(id) {
        return this.repository.getById(id);
    }
    getAllMedications() {
        return this.repository.getAll();
    }
    updateMedication(medication) {
        return this.repository.update(medication);
    }
    deleteMedication(id) {
        return this.repository.delete(id);
    }
}
exports.MedicationService = MedicationService;
//# sourceMappingURL=Medicationservices.js.map