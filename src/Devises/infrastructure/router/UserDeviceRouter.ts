import { Router } from "express";
import { UserDeviceController } from "../controllers/UserDeviceController";

export function RegisterUserDeviceRoutes(
  router: Router,
  controller: UserDeviceController
): void {
  const deviceGroup = Router();

  deviceGroup.post("/register", (req, res) =>
    controller.registerDevice(req, res)
  );

  router.use("/devices", deviceGroup);
}