import express from 'express';
import cors from 'cors';
import { RegisterUserRoutes } from './User/Infraestructure/Router/UserRouter';
import { RegisterMedicationRoutes } from './Medication/Infraestructure/Routers/MedicationRouter';
import { UserController } from './User/Infraestructure/Controllers/UserController';
import { UserService } from './User/Application/Userservices';
import { MySQLUserRepository } from './User/Infraestructure/DataBase/MysqlUser';
import { MedicineController } from './Medication/Infraestructure/Controllers/MedicationControllers';
import { MedicationService } from './Medication/Application/Medicationservices';
import { MySQLMedicationRepository } from './Medication/Infraestructure/DataBase/MysqlMedication';

import { UserDeviceService } from "./Devises/application/UserDeviceService";
import { UserDeviceController } from "./Devises/infrastructure/controllers/UserDeviceController";
import { MySQLUserDeviceRepository } from "./Devises/infrastructure/database/MysqlDevicesRepository";
import { RegisterUserDeviceRoutes } from "./Devises/infrastructure/router/UserDeviceRouter";
import { initDB, pool } from './Core/MySQL';


const app = express();

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint funcionando',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', async (_, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    res.json({
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      status: 'OK',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

let isInitialized = false;

export async function initializeRoutes() {
  if (isInitialized) {
    console.log('✅ Rutas ya inicializadas');
    return;
  }

  try {
    console.log('🚀 Inicializando rutas...');

    await initDB();
    console.log('📦 Conexión MySQL lista');

    const userRepository = new MySQLUserRepository(pool);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);


    const userDeviceRepository = new MySQLUserDeviceRepository(pool);
    const userDeviceService = new UserDeviceService(userDeviceRepository);
    const userDeviceController = new UserDeviceController(userDeviceService);



    const medicationRepository = new MySQLMedicationRepository(pool);
    const medicationService = new MedicationService(
    medicationRepository,
    userDeviceRepository
);
    const medicationController = new MedicineController(medicationService);

    RegisterUserRoutes(app, userController);
    RegisterMedicationRoutes(app, medicationController);
    RegisterUserDeviceRoutes(app, userDeviceController);

    app.get('/', (_, res) => {
      res.json({
        mensaje: 'API Farmacia',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    });

    isInitialized = true;
    console.log('✅ Rutas inicializadas correctamente');

  } catch (error) {
    console.error('❌ Error FATAL inicializando rutas:', error);
    throw error;
  }
}

export default app;