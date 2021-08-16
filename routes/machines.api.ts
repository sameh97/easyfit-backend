import { Router } from "express";
import { inject, injectable } from "inversify";
import { MachinesController } from "../controllers/machines-controller";
import { AppRoute } from "./../common/interfaces/app-route";

@injectable()
export class MachinesApi implements AppRoute {
  private router: Router;

  constructor(
    @inject(MachinesController) private machinesController: MachinesController
  ) {
    this.setRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setRoutes(): void {
    this.router = Router();

    this.router.get("/api/machines", this.machinesController.getAll);
    this.router.post("/api/machine", this.machinesController.createMachine);
    this.router.put("/api/machine", this.machinesController.update);
    this.router.delete("/api/machine", this.machinesController.delete);

    this.router.get("/api/machine", this.machinesController.getBySerialNumber);
  }
}
