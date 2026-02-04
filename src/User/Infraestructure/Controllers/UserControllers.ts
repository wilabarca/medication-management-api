import { Request, Response } from "express";
import { User } from "../../Domain/Entities/User";
import { UserService } from "../../Application/Userservices";

export class UserController {

  constructor(private service: UserService) {}

  // ➕ Crear usuario
  async createUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const user: User = {
      id: '', // El repositorio asignará el ID
      name,
      email,
      password
    };

    await this.service.createUser(user);

    res.status(201).json({ mensaje: "Usuario creado exitosamente" });
  }

  // 📋 Obtener todos los usuarios
  async getAllUsers(req: Request, res: Response) {
    const users = await this.service.getAllUsers();
    res.json(users);
  }

  // 🔍 Obtener usuario por ID
  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID requerido" });
    }

    const user = await this.service.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  }

  // ✏️ Actualizar usuario
  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "ID requerido" });
    }

    const { name, email, password } = req.body;
    
    const updated: User = {
      id,
      name,
      email,
      password
    };

    try {
      await this.service.updateUser(updated);
      res.json({ mensaje: "Usuario actualizado exitosamente" });
    } catch {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  }

  // 🗑️ Eliminar usuario
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID requerido" });
    }

    try {
      await this.service.deleteUser(id);
      res.json({ mensaje: "Usuario eliminado exitosamente" });
    } catch {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  }
}