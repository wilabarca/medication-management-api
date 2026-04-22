import { Router } from "express";
import { PatientLinkTokenController } from "../Controllers/PatientLinkTokenController";

export function RegisterPatientLinkTokenRoutes(
  router: Router,
  controller: PatientLinkTokenController
): void {
  const group = Router();

  group.post("/:patientId/link-token", (req, res) =>
    controller.generateToken(req, res)
  );

  group.post("/link-account", (req, res) =>
    controller.consumeToken(req, res)
  );

  router.use("/patients", group);
}