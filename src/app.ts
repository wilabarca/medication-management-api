import express from 'express';
import cors from 'cors';
import { RegisterUserRoutes } from './User/Infraestructure/Router/UserRouter';
import { RegisterMedicationRoutes } from './Medication/Infraestructure/Routers/MedicationRouter';
import { UserController } from './User/Infraestructure/Controllers/UserControllers';
import { UserService } from './User/Application/Userservices';
import { MySQLUserRepository } from './User/Infraestructure/DataBase/MysqlUser';
import { MedicineController } from './Medication/Infraestructure/Controllers/MedicationControllers';
import { MedicationService } from './Medication/Application/Medicationservices';
import { MySQLMedicationRepository } from './Medication/Infraestructure/DataBase/MysqlMedication';
import { initDB, pool } from "./Core/MySQL";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'API Medicamentos OK' });
});

export async function initializeRoutes() {
  try {
    await initDB();

    const userRepository = new MySQLUserRepository(pool);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    const medicationRepository = new MySQLMedicationRepository(pool);
    const medicationService = new MedicationService(medicationRepository);
    const medicationController = new MedicineController(medicationService);

    RegisterUserRoutes(app, userController);
    RegisterMedicationRoutes(app, medicationController);

    app.get('/', (_, res) => {
      res.json({
        mensaje: 'API Farmacia',
        version: '1.0.0'
      });
    });

    console.log('✅ Rutas inicializadas');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default app;
