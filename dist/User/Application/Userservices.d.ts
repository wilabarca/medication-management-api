import { User } from '../Domain/Entities/User';
import { UserRepository } from '../Domain/Repositories/UserRepository';
export declare class UserService {
    private repository;
    constructor(repository: UserRepository);
    createUser(user: User): Promise<User>;
    updateUser(user: User): Promise<User>;
    deleteUser(id: string): Promise<void>;
    getAllUsers(): Promise<User[]>;
}
//# sourceMappingURL=Userservices.d.ts.map