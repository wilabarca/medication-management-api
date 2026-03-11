"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserRoutes = RegisterUserRoutes;
const express_1 = require("express");
// RegisterUserRoutes registra las rutas de usuarios en el router
function RegisterUserRoutes(router, userController) {
    // Agrupamos las rutas relacionadas con User
    const userGroup = (0, express_1.Router)();
    // Rutas públicas (no requieren autenticación)
    userGroup.get('/', (req, res) => userController.getAllUsers(req, res)); // Obtener todos los usuarios
    // CRUD
    userGroup.post('/', (req, res) => userController.createUser(req, res)); // Crear usuario
    userGroup.put('/:id', (req, res) => userController.updateUser(req, res)); // Actualizar usuario
    userGroup.delete('/:id', (req, res) => userController.deleteUser(req, res)); // Eliminar usuario
    // Registrar el grupo de rutas bajo /users
    router.use('/users', userGroup);
}
//# sourceMappingURL=UserRouter.js.map