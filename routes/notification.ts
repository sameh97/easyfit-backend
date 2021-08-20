import { Router } from "express";
import { injectable, inject } from "inversify";
import { AppRoute } from "../common/interfaces/app-route";
import { AppNotificationsController } from "../controllers/notifications-controller";

// TODO: use this
@injectable()
export class NotificationsApi implements AppRoute {
  private router: Router;

  constructor(
    @inject(AppNotificationsController) private appNotificationsController: AppNotificationsController
  ) {
    this.setRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setRoutes(): void {
    this.router = Router();

    this.router.get("/api/notifications", this.appNotificationsController.getAll);
    this.router.get("/api/machine/notifications", this.appNotificationsController.getByMachineSerialNumber);
    // this.router.post("/api/notification", this.appNotificationsController.create);
    this.router.put("/api/notification", this.appNotificationsController.update);
    this.router.delete("/api/notification", this.appNotificationsController.delete);
  }
}
