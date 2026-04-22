import { Request, Response } from "express";
import { PatientLinkTokenService } from "../../Application/PatientLinkTokenService";

export class PatientLinkTokenController {
  constructor(private service: PatientLinkTokenService) {}

  async generateToken(req: Request, res: Response): Promise<Response> {
    try {
      const { patientId } = req.params;
      const { caregiverUserId } = req.body;

      if (!patientId || !caregiverUserId) {
        return res.status(400).json({
          message: "patientId y caregiverUserId son requeridos",
        });
      }

      const result = await this.service.generateToken(patientId, caregiverUserId);

      return res.json(result);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Error generando token",
      });
    }
  }

  async consumeToken(req: Request, res: Response): Promise<Response> {
    try {
      const { token, userId } = req.body;

      if (!token || !userId) {
        return res.status(400).json({
          message: "token y userId son requeridos",
        });
      }

      const result = await this.service.consumeToken(token, userId);

      return res.json(result);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Error consumiendo token",
      });
    }
  }
}