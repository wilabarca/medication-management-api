import { User } from "../Entities/User";



export interface UserRepository {
  create(user: User): Promise<User>;
  getById(id: string): Promise<User | null>;
  getAll(): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}