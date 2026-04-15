import { Request, Response } from "express";
import { User } from "../../Domain/Entities/User";
import { UserService } from "../../Application/Userservices";

export class UserController {

  constructor(private userService: UserService) {}

  // Crear usuario (registro)
  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const user: User = req.body;
      const newUser = await this.userService.createUser(user);

      return res.status(201).json(newUser);

    } catch (error) {
      return res.status(500).json({
        message: "Error creating user"
      });
    }
  }

  // Login
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const token = await this.userService.login(email, password);

      if (!token) {
        return res.status(401).json({
          message: "Credenciales incorrectas"
        });
      }

      return res.json({
        token
      });

    } catch (error) {
      return res.status(500).json({
        message: "Error en login"
      });
    }
  }

  // Obtener todos los usuarios
  async getAllUsers(_req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.getAllUsers();

      return res.json(users);

    } catch (error) {
      return res.status(500).json({
        message: "Error fetching users"
      });
    }
  }

  // Obtener usuario por ID
  async getUserById(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;

      const user = await this.userService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          message: "Usuario no encontrado"
        });
      }

      return res.json(user);

    } catch (error) {
      return res.status(500).json({
        message: "Error fetching user"
      });
    }
  }

  // Actualizar usuario
  async updateUser(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;

      const user: User = {
        id,
        ...req.body
      };

      const updatedUser = await this.userService.updateUser(user);

      return res.json(updatedUser);

    } catch (error) {
      return res.status(500).json({
        message: "Error updating user"
      });
    }
  }

  // Eliminar usuario
  async deleteUser(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;

      await this.userService.deleteUser(id);

      return res.json({
        message: "Usuario eliminado"
      });

    } catch (error) {
      return res.status(500).json({
        message: "Error deleting user"
      });
    }
  }
}