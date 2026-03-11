"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeRoutes = initializeRoutes;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const UserRouter_1 = require("./User/Infraestructure/Router/UserRouter");
const MedicationRouter_1 = require("./Medication/Infraestructure/Routers/MedicationRouter");
const UserControllers_1 = require("./User/Infraestructure/Controllers/UserControllers");
const Userservices_1 = require("./User/Application/Userservices");
const MysqlUser_1 = require("./User/Infraestructure/DataBase/MysqlUser");
const MedicationControllers_1 = require("./Medication/Infraestructure/Controllers/MedicationControllers");
const Medicationservices_1 = require("./Medication/Application/Medicationservices");
const MysqlMedication_1 = require("./Medication/Infraestructure/DataBase/MysqlMedication");
const MySQL_1 = require("./Core/MySQL");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (_, res) => {
    res.json({ status: 'API Medicamentos OK' });
});
async function initializeRoutes() {
    try {
        await (0, MySQL_1.initDB)();
        const userRepository = new MysqlUser_1.MySQLUserRepository(MySQL_1.pool);
        const userService = new Userservices_1.UserService(userRepository);
        const userController = new UserControllers_1.UserController(userService);
        const medicationRepository = new MysqlMedication_1.MySQLMedicationRepository(MySQL_1.pool);
        const medicationService = new Medicationservices_1.MedicationService(medicationRepository);
        const medicationController = new MedicationControllers_1.MedicineController(medicationService);
        (0, UserRouter_1.RegisterUserRoutes)(app, userController);
        (0, MedicationRouter_1.RegisterMedicationRoutes)(app, medicationController);
        app.get('/', (_, res) => {
            res.json({
                mensaje: 'API Farmacia',
                version: '1.0.0'
            });
        });
        console.log('✅ Rutas inicializadas');
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
exports.default = app;
//# sourceMappingURL=app.js.map