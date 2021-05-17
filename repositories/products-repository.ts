import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { AlreadyExistError } from "../exeptions/already-exist-error";
import { NotFoundErr } from "../exeptions/not-found-error";
import { Product } from "../models/product";

@injectable()
export class ProductsRepository {
  constructor(@inject(Logger) private logger: Logger) {}

  public getAll = async (gymId: number): Promise<Product[]> => {
    return await Product.findAll({ where: { gymId: gymId } });
  };

  public save = async (
    product: Product,
    transaction?: Transaction
  ): Promise<Product> => {
    const productInDB = await Product.findOne({ where: { id: product.id } });
    if (AppUtils.hasValue(productInDB)) {
      throw new AlreadyExistError(
        `Product with id ${productInDB.id} already exist`
      );
    }

    this.logger.info(`Creating product with id ${product.id}`);

    const createdProduct = await Product.create(product, {
      transaction: transaction,
    });

    return createdProduct;
  };

  public update = async (
    product: Product,
    transaction?: Transaction
  ): Promise<Product> => {
    const productInDB = await Product.findOne({ where: { id: product.id } });

    if (!AppUtils.hasValue(productInDB)) {
      throw new NotFoundErr(
        `Cannot update Product with id ${product.id} because its not found`
      );
    }

    this.logger.info(`Updating product with id ${productInDB.id}`);

    const updatedProduct = await productInDB.update(product, {
      transaction: transaction,
    });

    this.logger.info(`updated product ${JSON.stringify(updatedProduct)}`);

    return updatedProduct;
  };

  public delete = async (id: number, transaction?: Transaction) => {
    const toDelete = await Product.findOne({ where: { id: id } });

    if (!AppUtils.hasValue(toDelete)) {
      throw new NotFoundErr(
        `Cannot delete Product with id ${id} because its not found`
      );
    }

    await Product.destroy({ where: { id: id }, transaction: transaction });
  };
}
