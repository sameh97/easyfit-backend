import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { TempUrl } from "../models/temp-url";
import { TempUrlRepository } from "../repositories/temp-url-repository";
import { AppDBConnection } from "./../config/database";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class TempUrlService {
  constructor(
    @inject(TempUrlRepository) private tempUrlRepository: TempUrlRepository,
    @inject(Logger) private logger: Logger,
    @inject(AppDBConnection) private appDBConnection: AppDBConnection
  ) {}

  public async create(tempUrl: TempUrl): Promise<TempUrl> {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      tempUrl.uuid = uuidv4();

      const createdTempUrl = await this.tempUrlRepository.save(
        tempUrl,
        transaction
      );

      await transaction.commit();

      this.logger.info(
        `created Temporary URL with uuid  ${createdTempUrl.uuid}`
      );

      return createdTempUrl;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error(
        `Error occurred while creating Temporary URL: error: ${AppUtils.getFullException(
          err
        )}`
      );
      throw err;
    }
  }

  public async getAll(gymId: number): Promise<TempUrl[]> {
    const tempUrls: TempUrl[] = await this.tempUrlRepository.getAll(gymId);
    this.logger.info(`Returning ${tempUrls.length} Temporary URL's`);
    return tempUrls;
  }

  public async getByUUID(uuid: string, gymId: number): Promise<TempUrl> {
    const tempUrl: TempUrl = await this.tempUrlRepository.getByUUID(
      uuid,
      gymId
    );
    this.logger.info(`Returning Temporary URL ${tempUrl.uuid}`);
    return tempUrl;
  }

  public update = async (tempUrl: TempUrl): Promise<TempUrl> => {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      const updatedTempUrl: TempUrl = await this.tempUrlRepository.update(
        tempUrl,
        transaction
      );

      await transaction.commit();

      this.logger.info(
        `updated Temporary URL with uuid ${updatedTempUrl.uuid}`
      );

      return updatedTempUrl;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error(
        `Error occurred while updating Temporary URL: error: ${AppUtils.getFullException(
          err
        )}`,
        err
      );
      throw err;
    }
  };

  public delete = async (uuid: string): Promise<void> => {
    let transaction: Transaction = null;
    try {
      this.logger.info(`Deleting Temporary URL with uuid ${uuid}`);

      transaction = await this.appDBConnection.createTransaction();

      await this.tempUrlRepository.delete(uuid, transaction);

      await transaction.commit();

      this.logger.info(`Temporary URL with uuid ${uuid} has been deleted.`);
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      throw err;
    }
  };
}
