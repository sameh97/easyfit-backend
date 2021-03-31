import { Router } from "express";
import { injectable, inject } from "inversify";
import { AppRoute } from "../common/interfaces/app-route";
import { UserController } from "../controllers/user-controller";
const verifyToken = require("../middlewares/jwt-functions");

// TODO: use this
@injectable()
export class UsersApi implements AppRoute {
  private router: Router;

  constructor(@inject(UserController) private usersController: UserController) {
    this.setRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setRoutes(): void {
    this.router = Router();

    this.router.post("/api/login", this.usersController.login);
    this.router.post("/api/register", this.usersController.createUser);
  }
}
