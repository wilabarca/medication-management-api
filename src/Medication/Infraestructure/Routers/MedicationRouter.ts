import { Router } from 'express';
import { MedicineController } from '../../Infraestructure/Controllers/MedicationControllers';

// RegisterMedicationRoutes registra las rutas de medicamentos en el router
export function RegisterMedicationRoutes(
  router: Router,
  medicationController: MedicineController
): void {
  // Agrupamos las rutas relacionadas con Medication
  const medicationGroup = Router();

  // Rutas públicas (no requieren autenticación)
  medicationGroup.get('/', (req, res) => 
    medicationController.getAllMedicines(req, res)
  ); // Obtener todos los medicamentos

  // Ruta con ID (también no requiere autenticación)
  medicationGroup.get('/:id', (req, res) => 
    medicationController.getMedicineById(req, res)
  ); // Obtener medicamento por ID

  // Rutas que no requieren autenticación para crear, actualizar y eliminar
  medicationGroup.post('/', (req, res) => 
    medicationController.createMedicine(req, res)
  ); // Crear medicamento

  medicationGroup.put('/:id', (req, res) => 
    medicationController.updateMedicine(req, res)
  ); // Actualizar medicamento

  medicationGroup.delete('/:id', (req, res) => 
    medicationController.deleteMedicine(req, res)
  ); // Eliminar medicamento

  // Registrar el grupo de rutas bajo /medications
  router.use('/medications', medicationGroup);
}