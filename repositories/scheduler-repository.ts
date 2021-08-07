import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { AlreadyExistError } from "../exeptions/already-exist-error";
import { NotFoundErr } from "../exeptions/not-found-error";
import { MachineScheduledJob } from "../models/machine-scheduled-job";

@injectable()
export class MachineSchedulerRepository {
  constructor(@inject(Logger) private logger: Logger) {}

  public getAll = async (gymId: number): Promise<MachineScheduledJob[]> => {
    return await MachineScheduledJob.findAll({ where: { gymId: gymId } });
  };

  public getAllWithoutGymId = async (): Promise<MachineScheduledJob[]> => {
    return await MachineScheduledJob.findAll({});
  };
  
  public save = async (
    scheduleJob: MachineScheduledJob,
    transaction?: Transaction
  ): Promise<MachineScheduledJob> => {
    const scheduleJobInDB = await MachineScheduledJob.findOne({
      where: { machineSerialNumber: scheduleJob.machineSerialNumber },
    });
    if (AppUtils.hasValue(scheduleJobInDB)) {
      throw new AlreadyExistError(
        `schedule with id ${scheduleJobInDB.id} already exist`
      );
    }

    this.logger.info(
      `Creating schedule job  ${JSON.stringify(scheduleJob.id)}`
    );

    const createdSchedule = await MachineScheduledJob.create(scheduleJob, {
      transaction: transaction,
    });

    return createdSchedule;
  };

  public update = async (
    scheduleJob: MachineScheduledJob,
    transaction?: Transaction
  ): Promise<MachineScheduledJob> => {
    const scheduleJobInDB = await MachineScheduledJob.findOne({
      where: { id: scheduleJob.id },
    });

    if (!AppUtils.hasValue(scheduleJobInDB)) {
      throw new NotFoundErr(
        `Cannot update scheduled Job with id ${scheduleJob.id} because its not found`
      );
    }

    this.logger.info(`Updating scheduled Job with id ${scheduleJobInDB.id}`);

    const updatedScheduleJob = await scheduleJobInDB.update(scheduleJob, {
      transaction,
    });

    this.logger.info(
      `updated schedule Job ${JSON.stringify(updatedScheduleJob)}`
    );

    return updatedScheduleJob;
  };

  public delete = async (id: number, transaction?: Transaction) => {
    const toDelete = await MachineScheduledJob.findOne({ where: { id: id } });

    if (!AppUtils.hasValue(toDelete)) {
      throw new NotFoundErr(
        `Cannot delete scheduled Job with id ${id} because its not found`
      );
    }

    await MachineScheduledJob.destroy({
      where: { id: id },
      transaction: transaction,
    });
  };
}
