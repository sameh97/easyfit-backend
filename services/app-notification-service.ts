import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { InputError } from "../exeptions/input-error";
import { AppNotification } from "../models/app-notification";
import { AppNotificationRepository } from "../repositories/app-notification-repository";
import { AppDBConnection } from "./../config/database";

@injectable()
export class AppNotificationService {
  constructor(
    @inject(AppNotificationRepository)
    private appNotificationRepository: AppNotificationRepository,
    @inject(Logger) private logger: Logger,
    @inject(AppDBConnection) private appDBConnection: AppDBConnection
  ) {}

  public async create(
    appNotification: AppNotification
  ): Promise<AppNotification> {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      const createdNotification = await this.appNotificationRepository.save(
        appNotification,
        transaction
      );

      await transaction.commit();

      this.logger.info(
        `created notification with id ${createdNotification.id}`
      );

      return createdNotification;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error(
        `Error occurred while creating notification: error: ${AppUtils.getFullException(
          err
        )}`
      );
      throw err;
    }
  }

  public async getAll(gymId: number): Promise<AppNotification[]> {
    const notifications = await this.appNotificationRepository.getAll(gymId);
    this.logger.info(`Returning ${notifications.length} notifications`);
    return notifications;
  }

  public async getByMachineSerialNumber(
    gymId: number,
    machineSerialNumber: string
  ): Promise<AppNotification[]> {
    const notifications =
      await this.appNotificationRepository.getByMachineSerialNumber(
        gymId,
        machineSerialNumber
      );
    this.logger.info(`Returning ${notifications.length} notifications`);
    return notifications;
  }

  public update = async (
    appNotification: AppNotification
  ): Promise<AppNotification> => {
    let transaction: Transaction = null;
    try {
      transaction = await this.appDBConnection.createTransaction();

      const updatedNotification = await this.appNotificationRepository.update(
        appNotification,
        transaction
      );

      await transaction.commit();

      this.logger.info(
        `updated notification with id ${updatedNotification.id}`
      );

      return updatedNotification;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error(
        `Error occurred while updating notification: error: ${AppUtils.getFullException(
          err
        )}`,
        err
      );
      throw err;
    }
  };

  public delete = async (id: number): Promise<void> => {
    if (!AppUtils.isInteger(id)) {
      throw new InputError(
        `Cannot delete notification, the id must be an integer`
      );
    }

    let transaction: Transaction = null;
    try {
      this.logger.info(`Deleting notification with id: ${id}`);

      transaction = await this.appDBConnection.createTransaction();

      await this.appNotificationRepository.delete(id, transaction);

      await transaction.commit();

      this.logger.info(`Notification with id ${id} has been deleted.`);
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      throw err;
    }
  };
}
