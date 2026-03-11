import { Request, Response } from "express";
import { MedicationService } from "../../Application/Medicationservices";
export declare class MedicineController {
    private service;
    constructor(service: MedicationService);
    createMedicine(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAllMedicines(req: Request, res: Response): Promise<void>;
    getMedicineById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateMedicine(req: Request, res: Response): Promise<void>;
    deleteMedicine(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=MedicationControllers.d.ts.map