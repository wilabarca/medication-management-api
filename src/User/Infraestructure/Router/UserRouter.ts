import { Router } from 'express';
import { UserController } from '../../Infraestructure/Controllers/UserControllers';

// RegisterUserRoutes registra las rutas de usuarios en el router
export function RegisterUserRoutes(
  router: Router,
  userController: UserController
): void {
  // Agrupamos las rutas relacionadas con User
  const userGroup = Router();

  // Rutas públicas (no requieren autenticación)
  userGroup.get('/', (req, res) => 
    userController.getAllUsers(req, res)
  ); // Obtener todos los usuarios

  // Ruta con ID
  userGroup.get('/:id', (req, res) => 
    userController.getUserById(req, res)
  ); // Obtener usuario por ID

  // CRUD
  userGroup.post('/', (req, res) => 
    userController.createUser(req, res)
  ); // Crear usuario

  userGroup.put('/:id', (req, res) => 
    userController.updateUser(req, res)
  ); // Actualizar usuario

  userGroup.delete('/:id', (req, res) => 
    userController.deleteUser(req, res)
  ); // Eliminar usuario

  // Registrar el grupo de rutas bajo /users
  router.use('/users', userGroup);
}