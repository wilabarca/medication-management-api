import { Router } from 'express';
import { MedicineController } from '../../Infraestructure/Controllers/MedicationControllers';

export function RegisterMedicationRoutes(
  router: Router,
  medicationController: MedicineController
): void {

  const medicationGroup = Router();

  medicationGroup.get('/', (req, res) =>
    medicationController.getAllMedicines(req, res)
  );

  medicationGroup.get('/:id', (req, res) =>
    medicationController.getMedicineById(req, res)
  );

  medicationGroup.post('/', (req, res) =>
    medicationController.createMedicine(req, res)
  );

  medicationGroup.put('/:id', (req, res) =>
    medicationController.updateMedicine(req, res)
  );

  medicationGroup.delete('/:id', (req, res) =>
    medicationController.deleteMedicine(req, res)
  );

  router.use('/medications', medicationGroup);
}
