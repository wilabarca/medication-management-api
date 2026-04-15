import { Request, Response } from "express";
import { UserDeviceService } from "../../application/UserDeviceService";
import { UserDevice } from "../../domain/Entities/UserDevice";

export class UserDeviceController {
  constructor(private service: UserDeviceService) {}

  async registerDevice(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, deviceId, fcmToken } = req.body;

      if (!userId || !deviceId || !fcmToken) {
        return res.status(400).json({
          message: "userId, deviceId y fcmToken son requeridos"
        });
      }

      const device: UserDevice = {
        id: "",
        userId,
        deviceId,
        fcmToken
      };

      await this.service.registerDevice(device);

      return res.status(200).json({
        message: "Dispositivo registrado correctamente"
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error al registrar dispositivo"
      });
    }
  }
}