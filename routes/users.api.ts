import { Router } from "express";
import { injectable, inject } from "inversify";
import { AppRoute } from "../common/interfaces/app-route";
import { UserController } from "../controllers/user-controller";
import { MemebrsController } from "../controllers/members-controller";

// TODO: use this
@injectable()
export class UsersApi implements AppRoute {
  private router: Router;

  constructor(
    @inject(UserController) private usersController: UserController,
    @inject(MemebrsController) private membersController: MemebrsController
  ) {
    this.setRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setRoutes(): void {
    this.router = Router();

    this.router.post("/api/login", this.usersController.login);
    this.router.post("/api/register", this.usersController.createUser);
    this.router.post("/api/members", this.membersController.getAll);
    this.router.post("/api/add-member", this.membersController.createMember);
  }
}
