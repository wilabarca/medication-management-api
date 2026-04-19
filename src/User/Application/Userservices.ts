import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../Domain/Repositories/UserRepository";
import { User } from "../Domain/Entities/User";

export class UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async createUser(user: User): Promise<User> {
    if (!user.role || !["caregiver", "patient"].includes(user.role)) {
      throw new Error("Rol inválido");
    }

    const existingUser = await this.repository.getByEmail(user.email);
    if (existingUser) {
      throw new Error("El correo ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser: User = {
      ...user,
      password: hashedPassword,
    };

    return this.repository.create(newUser);
  }

  async login(email: string, password: string): Promise<{
    token: string;
    user: Omit<User, "password">;
  } | null> {
    const user = await this.repository.getByEmail(email);

    if (!user) return null;

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return null;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1h" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getUserById(id: string): Promise<User | null> {
    return this.repository.getById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.getAll();
  }

  async updateUser(user: User): Promise<User> {
    return this.repository.update(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}