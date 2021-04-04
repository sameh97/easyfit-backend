import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { Gym } from "../models/gym";
import { GymRepository } from "../repositories/gym-repository";
import { AppDBConnection } from "./../config/database";

@injectable()
export class GymService {
  constructor(
    @inject(Logger) private logger: Logger,
    @inject(AppDBConnection) private appDBConnection: AppDBConnection,
    @inject(GymRepository) private gymRepo: GymRepository
  ) {}

  public async create(gym: Gym): Promise<Gym> {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      const createdGym = await this.gymRepo.save(gym, transaction);

      await transaction.commit();

      this.logger.info(`created gym with id ${createdGym.id}`);

      return createdGym;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error(
        `Error occurred while creating gym: error: ${AppUtils.getFullException(
          err
        )}`
      );
      throw err;
    }
  }
}
