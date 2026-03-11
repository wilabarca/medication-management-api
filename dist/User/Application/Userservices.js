"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    constructor(repository) {
        this.repository = repository;
    }
    async createUser(user) {
        return this.repository.create(user);
    }
    async updateUser(user) {
        return this.repository.update(user);
    }
    async deleteUser(id) {
        await this.repository.delete(id);
    }
    async getAllUsers() {
        return this.repository.getAll();
    }
}
exports.UserService = UserService;
//# sourceMappingURL=Userservices.js.map