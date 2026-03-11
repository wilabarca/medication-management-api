"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLUserRepository = void 0;
const uuid_1 = require("uuid");
class MySQLUserRepository {
    constructor(db) {
        this.db = db;
    }
    async create(user) {
        const id = (0, uuid_1.v4)();
        await this.db.execute(`INSERT INTO users (id,name,email,password) VALUES (?,?,?,?)`, [id, user.name, user.email, user.password]);
        return { ...user, id };
    }
    async getAll() {
        const [rows] = await this.db.execute(`SELECT * FROM users`);
        return rows;
    }
    async update(user) {
        await this.db.execute(`UPDATE users SET name=?,email=?,password=? WHERE id=?`, [user.name, user.email, user.password, user.id]);
        return user;
    }
    async delete(id) {
        await this.db.execute(`DELETE FROM users WHERE id=?`, [id]);
    }
}
exports.MySQLUserRepository = MySQLUserRepository;
//# sourceMappingURL=MysqlUser.js.map