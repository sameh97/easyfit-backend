import { Router } from "express";
import { injectable, inject } from "inversify";
import { AppRoute } from "../common/interfaces/app-route";
import { TempUrlController } from "../controllers/temp-url-controller";

@injectable()
export class TempUrlApi implements AppRoute {
  private router: Router;

  constructor(
    @inject(TempUrlController) private tempUrlController: TempUrlController
  ) {
    this.setRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setRoutes(): void {
    this.router = Router();

    this.router.get("/api/catalog-urls", this.tempUrlController.getAll);
    this.router.get("/api/catalog-url/:uuid", this.tempUrlController.getByUUID);
    this.router.post("/api/catalog-url", this.tempUrlController.createMember);
    this.router.put("/api/catalog-url", this.tempUrlController.update);
    this.router.delete("/api/catalog-url", this.tempUrlController.delete);
  }
}
