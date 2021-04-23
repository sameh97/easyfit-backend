import { Router } from "express";
import { injectable, inject } from "inversify";
import { AppRoute } from "../common/interfaces/app-route";
import { ProductsController } from "../controllers/products-controller";

// TODO: use this
@injectable()
export class ProductsApi implements AppRoute {
  private router: Router;

  constructor(
    @inject(ProductsController) private productsController: ProductsController
  ) {
    this.setRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setRoutes(): void {
    this.router = Router();

    this.router.post("/api/products", this.productsController.getAll);
    this.router.post("/api/add-product", this.productsController.createProduct);
    this.router.post("/api/update-product", this.productsController.update);
    this.router.post("/api/delete-product/:id", this.productsController.delete);
  }
}
