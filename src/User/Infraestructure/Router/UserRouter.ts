import { Router } from "express";
import { UserController } from "../Controllers/UserControllers";

export function RegisterUserRoutes(
  router: Router,
  userController: UserController
): void {

  const userGroup = Router();

  // LOGIN
  userGroup.post("/login", (req, res) =>
    userController.login(req, res)
  );

  // REGISTER
  userGroup.post("/", (req, res) =>
    userController.createUser(req, res)
  );

  // GET ALL USERS
  userGroup.get("/", (req, res) =>
    userController.getAllUsers(req, res)
  );

  // GET USER BY ID
  userGroup.get("/:id", (req, res) =>
    userController.getUserById(req, res)
  );

  // UPDATE USER
  userGroup.put("/:id", (req, res) =>
    userController.updateUser(req, res)
  );

  // DELETE USER
  userGroup.delete("/:id", (req, res) =>
    userController.deleteUser(req, res)
  );

  router.use("/users", userGroup);
}