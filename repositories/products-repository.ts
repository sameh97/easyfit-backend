import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { ProductDtoMapper } from "../common/dto-mapper/products-dto-mapper";
import { Logger } from "../common/logger";
import { AlreadyExistError } from "../exeptions/already-exist-error";
import { NotFoundErr } from "../exeptions/not-found-error";
import { Bill } from "../models/bill";
import { Product } from "../models/product";

@injectable()
export class ProductsRepository {
  constructor(
    @inject(Logger) private logger: Logger,
    @inject(ProductDtoMapper) private productDtoMapper: ProductDtoMapper
  ) {}

  public getAll = async (gymId: number): Promise<Product[]> => {
    return await Product.findAll({ where: { gymId: gymId } });
  };

  public getByIDs = async (idsArray: number[]): Promise<Product[]> => {
    // get all the products by ids array
    return await Product.findAll({ where: { id: idsArray } });
  };

  public save = async (
    product: Product,
    transaction?: Transaction
  ): Promise<Product> => {
    const productInDB = await Product.findOne({
      where: { code: product.code }, // TODO: check by something else than id
      transaction: transaction,
    });
    if (AppUtils.hasValue(productInDB)) {
      throw new AlreadyExistError(
        `Product with code ${productInDB.code} already exist`
      );
    }

    this.logger.info(`Creating product with code ${product.code}`);

    const createdProduct = await Product.create(product, {
      transaction: transaction,
    });

    return createdProduct;
  };

  public createBill = async (
    bill: Bill,
    transaction?: Transaction
  ): Promise<Bill> => {
    // create receipt
    const productInDB = await Product.findOne({
      where: { id: bill.productID },
      transaction: transaction,
    });

    if (!AppUtils.hasValue(productInDB)) {
      throw new NotFoundErr(
        `Cannot create bill because product with id ${bill.productID} is not found`
      );
    }

    const productToUpdate: Product =
      this.productDtoMapper.asEntity(productInDB);

    productToUpdate.quantity -= bill.quantity;

    const updatedProduct = await this.update(productToUpdate, transaction);

    const createdBill = await Bill.create(bill, { transaction: transaction });

    return createdBill;
  };

  public getAllBills = async (gymId: number): Promise<Bill[]> => {
    return await Bill.findAll({ where: { gymId: gymId } });
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
