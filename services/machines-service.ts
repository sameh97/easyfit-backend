import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { Json } from "sequelize/types/lib/utils";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { AppDBConnection } from "../config/database";
import { InputError } from "../exeptions/input-error";
import { Machine } from "../models/machines";
import { MachinesRepository } from "../repositories/machine-repository";

@injectable()
export class MachinesService {
  constructor(
    @inject(AppDBConnection) private appDBConnection: AppDBConnection,
    @inject(Logger) private logger: Logger,
    @inject(MachinesRepository) private machinesRepository: MachinesRepository
  ) {}

  public getAll = async (gymId: number): Promise<Machine[]> => {
    const machines = await this.machinesRepository.getAll(gymId);
    this.logger.info(`Returning ${machines.length} machines`);
    return machines;
  };

  public getBySerialNumber = async (
    machineSerialNumber: number
  ): Promise<Machine> => {
    const machine = await this.machinesRepository.getBySerialNumber(machineSerialNumber);
    this.logger.info(`Returning machine with serial number ${machineSerialNumber}`);
    return machine;
  };

  public create = async (machine: Machine): Promise<Machine> => {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      this.logger.info(`creating machine with id ${machine.id}`);

      const createdMachine = await this.machinesRepository.save(
        machine,
        transaction
      );

      this.logger.info(`created machine with id ${JSON.stringify(machine)}`);

      transaction.commit();

      return createdMachine;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error(
        `Error while creating machine , error: ${AppUtils.getFullException(
          error
        )}`,
        error
      );
      throw error;
    }
  };

  public update = async (machine: Machine): Promise<Machine> => {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      const updatedMachine = await this.machinesRepository.update(
        machine,
        transaction
      );

      await transaction.commit();

      this.logger.info(`updated machine with name ${updatedMachine.name}`);

      return updatedMachine;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error(
        `cannot update member, error ${AppUtils.getFullException(error)}`,
        error
      );
      throw error;
    }
  };

  public delete = async (id: number): Promise<void> => {
    if (!AppUtils.isInteger(id)) {
      throw new InputError(`Cannot delete machine, the id must be an integer`);
    }

    let transaction: Transaction = null;
    try {
      this.logger.info(`Deleting machine with id: ${id}`);

      transaction = await this.appDBConnection.createTransaction();

      await this.machinesRepository.delete(id, transaction);

      transaction.commit();

      this.logger.info(`Machine with id ${id} has been deleted`);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error(
        `Error occurred while deleting machine: error: ${AppUtils.getFullException(
          error
        )}`,
        error
      );
      throw error;
    }
  };
}
