import mysql from 'mysql2/promise';
import { User } from '../../Domain/Entities/User';
import { UserRepository } from '../../Domain/Repositories/UserRepository';
export declare class MySQLUserRepository implements UserRepository {
    private db;
    constructor(db: mysql.Pool);
    create(user: User): Promise<User>;
    getAll(): Promise<User[]>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=MysqlUser.d.ts.map