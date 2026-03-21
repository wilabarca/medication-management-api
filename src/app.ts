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
import { initDB, getPool } from "./Core/MySQL";

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba URGENTE - esta debe funcionar siempre
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint funcionando',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', async (_, res) => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
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
    
    // Inicializar DB
    await initDB();
    const pool = getPool();
    console.log('📦 Pool obtenido correctamente');

    // Crear repositorios con el pool
    const userRepository = new MySQLUserRepository(pool);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    const medicationRepository = new MySQLMedicationRepository(pool);
    const medicationService = new MedicationService(medicationRepository);
    const medicationController = new MedicineController(medicationService);

    // Registrar rutas
    RegisterUserRoutes(app, userController);
    RegisterMedicationRoutes(app, medicationController);

    // Ruta principal
    app.get('/', (_, res) => {
      res.json({
        mensaje: 'API Farmacia',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    });

    isInitialized = true;
    console.log('✅ Rutas inicializadas correctamente');
    console.log('📋 Rutas disponibles: /, /test, /health, /users/*, /medications/*');
    
  } catch (error) {
    console.error('❌ Error FATAL inicializando rutas:', error);
    throw error;
  }
}

// IMPORTANTE: Inicializar inmediatamente para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  initializeRoutes().catch(console.error);
}

export default app;