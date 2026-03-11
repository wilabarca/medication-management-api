import { Request, Response } from "express";
import { User } from "../../Domain/Entities/User";
import { UserService } from "../../Application/Userservices";


export class UserController {

  constructor(private userService: UserService) {}

  // Crear usuario (registro)
  async createUser(req: Request, res: Response) {
    try {

      const user: User = req.body;

      const newUser = await this.userService.createUser(user);

      res.status(201).json(newUser);

    } catch (error) {
      res.status(500).json({
        message: "Error creating user"
      });
    }
  }

  // Login
  async login(req: Request, res: Response) {
    try {

      const { email, password } = req.body;

      const token = await this.userService.login(email, password);

      if (!token) {
        return res.status(401).json({
          message: "Credenciales incorrectas"
        });
      }

      res.json({
        token
      });

    } catch (error) {
      res.status(500).json({
        message: "Error en login"
      });
    }
  }

  // Obtener todos los usuarios
  async getAllUsers(req: Request, res: Response) {
    try {

      const users = await this.userService.getAllUsers();

      res.json(users);

    } catch (error) {
      res.status(500).json({
        message: "Error fetching users"
      });
    }
  }

  // Obtener usuario por ID
  async getUserById(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {

      const { id } = req.params;

      const user = await this.userService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          message: "Usuario no encontrado"
        });
      }

      res.json(user);

    } catch (error) {
      res.status(500).json({
        message: "Error fetching user"
      });
    }
  }

  // Actualizar usuario
  async updateUser(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {

      const { id } = req.params;

      const user: User = {
        id,
        ...req.body
      };

      const updatedUser = await this.userService.updateUser(user);

      res.json(updatedUser);

    } catch (error) {
      res.status(500).json({
        message: "Error updating user"
      });
    }
  }

  // Eliminar usuario
  async deleteUser(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {

      const { id } = req.params;

      await this.userService.deleteUser(id);

      res.json({
        message: "Usuario eliminado"
      });

    } catch (error) {
      res.status(500).json({
        message: "Error deleting user"
      });
    }
  }

}