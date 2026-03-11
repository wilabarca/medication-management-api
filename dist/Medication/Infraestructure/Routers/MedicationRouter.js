"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterMedicationRoutes = RegisterMedicationRoutes;
const express_1 = require("express");
function RegisterMedicationRoutes(router, medicationController) {
    const medicationGroup = (0, express_1.Router)();
    medicationGroup.get('/', (req, res) => medicationController.getAllMedicines(req, res));
    medicationGroup.get('/:id', (req, res) => medicationController.getMedicineById(req, res));
    medicationGroup.post('/', (req, res) => medicationController.createMedicine(req, res));
    medicationGroup.put('/:id', (req, res) => medicationController.updateMedicine(req, res));
    medicationGroup.delete('/:id', (req, res) => medicationController.deleteMedicine(req, res));
    router.use('/medications', medicationGroup);
}
//# sourceMappingURL=MedicationRouter.js.map