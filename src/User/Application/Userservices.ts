import { User } from '../Domain/Entities/User';
import { UserRepository } from '../Domain/Repositories/UserRepository';

export class UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async createUser(user: User): Promise<User> {
    return this.repository.create(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.repository.getById(id);
  }

  async updateUser(user: User): Promise<User> {
    return this.repository.update(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.getAll();
  }
}