import { Router } from "express";
import { injectable, inject } from "inversify";
import { AppRoute } from "../common/interfaces/app-route";
import { MachineSchedulerController } from "../controllers/scheduler-controller";

// TODO: use this
@injectable()
export class MachineSchedulerApi implements AppRoute {
  private router: Router;

  constructor(
    @inject(MachineSchedulerController)
    private machineSchedulerController: MachineSchedulerController
  ) {
    this.setRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setRoutes(): void {
    this.router = Router();

    this.router.get("/api/schedules", this.machineSchedulerController.getAll);
    this.router.post("/api/add-schedule", this.machineSchedulerController.create); 
    this.router.put("/api/update-schedule",this.machineSchedulerController.update);
    this.router.delete("/api/delete-schedule",this.machineSchedulerController.delete);
  }
}
