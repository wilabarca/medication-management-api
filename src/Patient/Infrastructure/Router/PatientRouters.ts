import { Router } from "express";
import { PatientController } from "../Controllers/PatientController";

export function RegisterPatientRoutes(
  router: Router,
  patientController: PatientController
): void {
  const patientGroup = Router();

  patientGroup.post("/", (req, res) =>
    patientController.createPatient(req, res)
  );

  patientGroup.get("/caregiver/:caregiverUserId", (req, res) =>
    patientController.getPatientsByCaregiver(req, res)
  );

  patientGroup.get("/:id", (req, res) =>
    patientController.getPatientById(req, res)
  );

  patientGroup.put("/:id", (req, res) =>
    patientController.updatePatient(req, res)
  );

  patientGroup.delete("/:id", (req, res) =>
    patientController.deletePatient(req, res)
  );

  router.use("/patients", patientGroup);
}