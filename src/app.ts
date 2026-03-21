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
import { initDB, getPool, checkHealth } from "./Core/MySQL";

const app = express();

app.use(cors());
app.use(express.json());

// Middleware para verificar la conexión a DB antes de cada request (opcional)
app.use(async (req, res, next) => {
  try {
    // Verificar salud de la conexión
    const isHealthy = await checkHealth();
    if (!isHealthy) {
      console.log('⚠️ Pool no saludable, reiniciando...');
      // Forzar recreación del pool en la próxima solicitud
      const { getPool: refreshPool } = await import('./Core/MySQL');
      refreshPool();
    }
    next();
  } catch (error) {
    console.error('Error en middleware de salud:', error);
    next();
  }
});

app.get('/health', async (_, res) => {
  try {
    const dbHealthy = await checkHealth();
    res.json({ 
      status: 'OK',
      database: dbHealthy ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      error: 'Database connection failed' 
    });
  }
});

export async function initializeRoutes() {
  let pool;
  try {
    console.log('🚀 Inicializando rutas...');
    await initDB();
    pool = getPool();
    console.log('📦 Pool obtenido correctamente');

    // Crear repositorios con el pool actual
    const userRepository = new MySQLUserRepository(pool);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    const medicationRepository = new MySQLMedicationRepository(pool);
    const medicationService = new MedicationService(medicationRepository);
    const medicationController = new MedicineController(medicationService);

    // Registrar rutas
    RegisterUserRoutes(app, userController);
    RegisterMedicationRoutes(app, medicationController);

    app.get('/', (_, res) => {
      res.json({
        mensaje: 'API Farmacia',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    });

    console.log('✅ Rutas inicializadas correctamente');
  } catch (error) {
    console.error('❌ Error inicializando rutas:', error);
    throw error;
  }
}

export default app;