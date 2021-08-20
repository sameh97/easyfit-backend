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

    this.router.get("/api/members", this.membersController.getAll);
    this.router.get("/api/members-phones", this.membersController.getAllPhones);
    this.router.post("/api/add-member", this.membersController.createMember);
    this.router.put("/api/update-member", this.membersController.update);
    this.router.delete("/api/member", this.membersController.delete);
  }
}
