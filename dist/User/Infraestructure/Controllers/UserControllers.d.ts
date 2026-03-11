import { Request, Response } from "express";
import { UserService } from "../../Application/Userservices";
export declare class UserController {
    private service;
    constructor(service: UserService);
    createUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAllUsers(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=UserControllers.d.ts.map