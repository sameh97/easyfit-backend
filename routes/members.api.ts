import { Router } from "express";
import { injectable, inject } from "inversify";
import { AppRoute } from "../common/interfaces/app-route";
import { MemebrsController } from "../controllers/members-controller";

// TODO: use this
@injectable()
export class MembersApi implements AppRoute {
  private router: Router;

  constructor(
    @inject(MemebrsController) private membersController: MemebrsController
  ) {
    this.setRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setRoutes(): void {
    this.router = Router();

    this.router.post("/api/members", this.membersController.getAll);
    this.router.post("/api/add-member", this.membersController.createMember);
    this.router.post("/api/update-member", this.membersController.update);
    this.router.post("/api/delete-member/:id", this.membersController.delete);
  }
}
