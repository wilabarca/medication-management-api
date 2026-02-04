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
import { connectDB } from "./Core/MySQL"; // ← Mantén esta línea igual

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de salud
app.get('/health', (_, res) => {
  res.json({ status: 'API Medicamentos OK' });
});

// Inicializar rutas con dependencias
export async function initializeRoutes() {
  try {
    // Conectar a la base de datos
    const connection = await connectDB();

    // ===== USER =====
    const userRepository = new MySQLUserRepository(connection);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    // ===== MEDICATION =====
    const medicationRepository = new MySQLMedicationRepository(connection);
    const medicationService = new MedicationService(medicationRepository);
    const medicationController = new MedicineController(medicationService);

    // Registrar rutas
    RegisterUserRoutes(app, userController);
    RegisterMedicationRoutes(app, medicationController);

    // Ruta raíz con información de endpoints
    app.get('/', (req, res) => {
      res.json({
        mensaje: 'API de Farmacia',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          users: {
            getAll: 'GET /users',
            getById: 'GET /users/:id',
            create: 'POST /users',
            update: 'PUT /users/:id',
            delete: 'DELETE /users/:id'
          },
          medications: {
            getAll: 'GET /medications',
            getById: 'GET /medications/:id',
            create: 'POST /medications',
            update: 'PUT /medications/:id',
            delete: 'DELETE /medications/:id'
          }
        }
      });
    });

    console.log('✅ Rutas inicializadas correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar rutas:', error);
    throw error;
  }
}

export default app;