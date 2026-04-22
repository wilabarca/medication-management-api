import { Router } from "express";
import { MedicineController } from "../Controllers/MedicationControllers";

export function RegisterMedicationRoutes(
  router: Router,
  medicationController: MedicineController
): void {
  const medicationGroup = Router();

  medicationGroup.post("/", (req, res) =>
    medicationController.createMedicine(req, res)
  );

  medicationGroup.get("/", (req, res) =>
    medicationController.getAllMedicines(req, res)
  );

  medicationGroup.get("/patient/:patientId", (req, res) =>
    medicationController.getMedicinesByPatient(req, res)
  );

  medicationGroup.get("/:id", (req, res) =>
    medicationController.getMedicationById(req, res)
  );

  medicationGroup.put("/:id", (req, res) =>
    medicationController.updateMedicine(req, res)
  );

  medicationGroup.delete("/:id", (req, res) =>
    medicationController.deleteMedicine(req, res)
  );

  router.use("/medications", medicationGroup);
}