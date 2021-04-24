import { Router } from "express";
import { inject, injectable } from "inversify";
import { AppRoute } from "../common/interfaces/app-route";
import { TrainerController } from "../controllers/trainer-controller";

@injectable()
export class TrainersApi implements AppRoute {
    private router : Router;

    constructor(
        @inject(TrainerController) private trainerController : TrainerController
    ){
        this.setRoutes();
    }

    getRouter(): Router{
        return this.router;
    }
    private setRoutes() {
        this.router = Router();

        this.router.post("/api/trainers",this.trainerController.getAll);
        this.router.post("/api/add-trainer",this.trainerController.createTrainer);
        this.router.post("/api/update-trainer", this.trainerController.Update);
        this.router.post("/api/delete-trainer/:id", this.trainerController.delete);
    }
}