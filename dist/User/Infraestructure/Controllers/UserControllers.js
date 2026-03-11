"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    constructor(service) {
        this.service = service;
    }
    // ➕ Crear usuario
    async createUser(req, res) {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Todos los campos son requeridos" });
        }
        const user = {
            id: '', // El repositorio asignará el ID
            name,
            email,
            password
        };
        await this.service.createUser(user);
        res.status(201).json({ mensaje: "Usuario creado exitosamente" });
    }
    // 📋 Obtener todos los usuarios
    async getAllUsers(req, res) {
        const users = await this.service.getAllUsers();
        res.json(users);
    }
    // ✏️ Actualizar usuario
    async updateUser(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID requerido" });
        }
        const { name, email, password } = req.body;
        const updated = {
            id,
            name,
            email,
            password
        };
        try {
            await this.service.updateUser(updated);
            res.json({ mensaje: "Usuario actualizado exitosamente" });
        }
        catch {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    }
    // 🗑️ Eliminar usuario
    async deleteUser(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID requerido" });
        }
        try {
            await this.service.deleteUser(id);
            res.json({ mensaje: "Usuario eliminado exitosamente" });
        }
        catch {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserControllers.js.map