import mysql from 'mysql2/promise';
import { Medication } from '../../Domain/Entities/Medication';
import { MedicationRepository } from '../../Domain/Repositories/MedicationRepository';
export declare class MySQLMedicationRepository implements MedicationRepository {
    private db;
    constructor(db: mysql.Pool);
    create(medication: Medication): Promise<Medication>;
    getById(id: string): Promise<Medication | null>;
    getAll(): Promise<Medication[]>;
    update(medication: Medication): Promise<Medication>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=MysqlMedication.d.ts.map