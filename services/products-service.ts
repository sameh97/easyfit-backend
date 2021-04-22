import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { AppDBConnection } from "../config/database";
import { InputError } from "../exeptions/input-error";
import { Product } from "../models/product";
import { ProductsRepository } from "../repositories/products-repository";

@injectable()
export class ProductsService {
  constructor(
    @inject(Logger) private logger: Logger,
    @inject(ProductsRepository) private productRepo: ProductsRepository,
    @inject(AppDBConnection) private appDBConnection: AppDBConnection
  ) {}

  public create = async (product: Product): Promise<Product> => {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      const createdProduct = await this.productRepo.save(product, transaction);

      await transaction.commit();

      this.logger.info(`created product with id ${createdProduct.id}`);

      return createdProduct;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error(
        `Error occurred while creating product: error: ${AppUtils.getFullException(
          err
        )}`
      );
      throw err;
    }
  };

  public getAll = async (gymId: number): Promise<Product[]> => {
    const products: Product[] = await this.productRepo.getAll(gymId);
    this.logger.info(`Returning ${products.length} products`);
    return products;
  };

  public update = async (product: Product): Promise<Product> => {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      const updatedProduct = await this.productRepo.update(
        product,
        transaction
      );

      await transaction.commit();

      this.logger.info(`updated product with id ${updatedProduct.id}`);

      return updatedProduct;
    } catch (err) {
      if (transaction) {
        transaction.rollback();
      }
      this.logger.error(
        `Error occurred while creating product: error: ${AppUtils.getFullException(
          err
        )}`
      );
      throw err;
    }
  };

  public delete = async (id: number): Promise<void> => {
    if (!AppUtils.isInteger(id)) {
      throw new InputError(`Cannot delete product, the id must be an integer`);
    }

    let transaction: Transaction = null;
    try {
      this.logger.info(`Deleting product with id: ${id}`);

      transaction = await this.appDBConnection.createTransaction();

      await this.productRepo.delete(id, transaction);

      await transaction.commit();

      this.logger.info(`Product with id ${id} has been deleted.`);
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      throw err;
    }
  };
}
