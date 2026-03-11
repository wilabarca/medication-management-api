"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLMedicationRepository = void 0;
const uuid_1 = require("uuid");
class MySQLMedicationRepository {
    constructor(db) {
        this.db = db;
    }
    async create(medication) {
        const id = (0, uuid_1.v4)();
        await this.db.execute(`INSERT INTO medications (id,name,description,quantity,price) VALUES (?,?,?,?,?)`, [
            id,
            medication.name,
            medication.description,
            medication.quantity,
            medication.price
        ]);
        return { ...medication, id };
    }
    async getById(id) {
        const [rows] = await this.db.execute(`SELECT * FROM medications WHERE id=?`, [id]);
        return rows[0] || null;
    }
    async getAll() {
        const [rows] = await this.db.execute(`SELECT * FROM medications`);
        return rows;
    }
    async update(medication) {
        await this.db.execute(`UPDATE medications SET name=?,description=?,quantity=?,price=? WHERE id=?`, [
            medication.name,
            medication.description,
            medication.quantity,
            medication.price,
            medication.id
        ]);
        return medication;
    }
    async delete(id) {
        await this.db.execute(`DELETE FROM medications WHERE id=?`, [id]);
    }
}
exports.MySQLMedicationRepository = MySQLMedicationRepository;
//# sourceMappingURL=MysqlMedication.js.map