import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { AlreadyExistError } from "../exeptions/already-exist-error";
import { Gym } from "../models/gym";

@injectable()
export class GymRepository {
  constructor(@inject(Logger) private logger: Logger) {}

  public async save(gym: Gym, transaction?: Transaction): Promise<Gym> {
    //TODO: check if phone is a good key for searching for gym in DB
    const gymInDB = await Gym.findOne({
      where: { phone: gym.phone },
    });

    if (AppUtils.hasValue(gymInDB)) {
      throw new AlreadyExistError(
        `gym with name '${gymInDB.name} allready exist`
      );
    }

    this.logger.info(`Creating gym : '${gym}'`);

    const createdGym = await Gym.create(gym);

    this.logger.info(`created gym ${JSON.stringify(createdGym)}`);

    return createdGym;
  }
}
