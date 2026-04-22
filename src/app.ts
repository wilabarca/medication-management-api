import express from 'express';
import cors from 'cors';

import { RegisterUserRoutes } from './User/Infrastructure/Router/UserRouter';
import { RegisterMedicationRoutes } from './Medication/Infrastructure/Routers/MedicationRouter';
import { UserController } from './User/Infrastructure/Controllers/UserController';
import { UserService } from './User/Application/Userservices';
import { MySQLUserRepository } from './User/Infrastructure/DataBase/MysqlUser';
import { MedicineController } from './Medication/Infrastructure/Controllers/MedicationControllers';
import { MedicationService } from './Medication/Application/Medicationservices';
import { MySQLMedicationRepository } from './Medication/Infrastructure/DataBase/MysqlMedication';

import { UserDeviceService } from "./Devises/application/UserDeviceService";
import { UserDeviceController } from "./Devises/infrastructure/controllers/UserDeviceController";
import { MySQLUserDeviceRepository } from "./Devises/infrastructure/database/MysqlDevicesRepository";
import { RegisterUserDeviceRoutes } from "./Devises/infrastructure/router/UserDeviceRouter";
import { initDB, pool } from './Core/MySQL';

import { PatientService } from './Patient/Application/PatientService';
import { PatientController } from './Patient/Infrastructure/Controllers/PatientController';
import { MySQLPatientRepository } from './Patient/Infrastructure/Database/MySQLPatient';
import { RegisterPatientRoutes } from './Patient/Infrastructure/Router/PatientRouters';

import { PatientLinkTokenService } from './Patient/Application/PatientLinkTokenService';
import { PatientLinkTokenController } from './Patient/Infrastructure/Controllers/PatientLinkTokenController';
import { MySQLPatientLinkTokenRepository } from './Patient/Infrastructure/Database/MySQLPatientLinkTokenRepository';
import { RegisterPatientLinkTokenRoutes } from './Patient/Infrastructure/Router/PatientLinkTokenRoutes';

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
    /* Usuarios*/
    const userRepository = new MySQLUserRepository(pool);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);


    const userDeviceRepository = new MySQLUserDeviceRepository(pool);
    const userDeviceService = new UserDeviceService(userDeviceRepository);
    const userDeviceController = new UserDeviceController(userDeviceService);

//---------------------------------------------------------------
/* Pacientes */

const patientRepository = new MySQLPatientRepository(pool);
const patientService = new PatientService(patientRepository);
const patientController = new PatientController(patientService);

//---------------------------------------------------------------

    /* Medicamentos */
const medicationRepository = new MySQLMedicationRepository(pool);
const medicationService = new MedicationService(medicationRepository);
const medicationController = new MedicineController(medicationService);

const patientLinkTokenRepository = new MySQLPatientLinkTokenRepository(pool);
const patientLinkTokenService = new PatientLinkTokenService(
  patientRepository,
  patientLinkTokenRepository
);
const patientLinkTokenController = new PatientLinkTokenController(
  patientLinkTokenService
);


    RegisterUserRoutes(app, userController);
    RegisterMedicationRoutes(app, medicationController);
    RegisterUserDeviceRoutes(app, userDeviceController);
    RegisterPatientRoutes(app, patientController);
    RegisterPatientLinkTokenRoutes(app, patientLinkTokenController);

    
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