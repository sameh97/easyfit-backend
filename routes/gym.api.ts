import { Router } from "express";
import { injectable, inject } from "inversify";
import { AppRoute } from "../common/interfaces/app-route";
import { GymController } from "../controllers/gym-controller";

const verifyToken = require("../middlewares/jwt-functions");

// TODO: use this
@injectable()
export class GymApi implements AppRoute {
  private router: Router;

  constructor(@inject(GymController) private gymController: GymController) {
    this.setRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setRoutes(): void {
    this.router = Router();
    this.router.post("/api/add-gym", verifyToken, this.gymController.createGym);
  }
}

