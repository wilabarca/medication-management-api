import { Request, Response } from "express";
import { User } from "../../Domain/Entities/User";
import { UserService } from "../../Application/Userservices";

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({
          message: "name, email, password y role son requeridos",
        });
      }

      if (!["caregiver", "patient"].includes(role)) {
        return res.status(400).json({
          message: "role debe ser caregiver o patient",
        });
      }

      const user: User = {
        id: "",
        name,
        email,
        password,
        role,
      };

      const newUser = await this.userService.createUser(user);

      return res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Error creating user",
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const result = await this.userService.login(email, password);

      if (!result) {
        return res.status(401).json({
          message: "Credenciales incorrectas",
        });
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Error en login",
      });
    }
  }

  async getAllUsers(_req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching users",
      });
    }
  }

  async getUserById(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching user",
      });
    }
  }

  async updateUser(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, email, password, role } = req.body;

      const user: User = {
        id,
        name,
        email,
        password,
        role,
      };

      const updatedUser = await this.userService.updateUser(user);

      return res.json(updatedUser);
    } catch (error) {
      return res.status(500).json({
        message: "Error updating user",
      });
    }
  }

  async deleteUser(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);

      return res.json({
        message: "Usuario eliminado",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error deleting user",
      });
    }
  }
}