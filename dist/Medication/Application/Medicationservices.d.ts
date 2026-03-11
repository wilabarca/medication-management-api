import { Medication } from '../Domain/Entities/Medication';
import { MedicationRepository } from '../Domain/Repositories/MedicationRepository';
export declare class MedicationService {
    private repository;
    constructor(repository: MedicationRepository);
    createMedication(medication: Medication): Promise<Medication>;
    getMedicationById(id: string): Promise<Medication | null>;
    getAllMedications(): Promise<Medication[]>;
    updateMedication(medication: Medication): Promise<Medication>;
    deleteMedication(id: string): Promise<void>;
}
//# sourceMappingURL=Medicationservices.d.ts.map