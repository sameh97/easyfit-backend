import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { SocketTopics } from "../common/socket-util";
import { InputError } from "../exeptions/input-error";
import { NotFound } from "../exeptions/notFound-exeption";
import { AppNotification } from "../models/app-notification";
import { AppNotificationMessage } from "../models/app-notification-message";
import { Machine } from "../models/machines";
import { AppNotificationRepository } from "../repositories/app-notification-repository";
import { MachinesRepository } from "../repositories/machine-repository";
import { AppDBConnection } from "./../config/database";
import { CacheService } from "./cache-service";
import { WebSocketService } from "./socket.io-service";

@injectable()
export class AppNotificationService {
  constructor(
    @inject(AppNotificationRepository)
    private appNotificationRepository: AppNotificationRepository,
    @inject(Logger) private logger: Logger,
    @inject(MachinesRepository) private machinesRepository: MachinesRepository,

    @inject(AppDBConnection) private appDBConnection: AppDBConnection,
    @inject(CacheService)
    private cacheService: CacheService,
    @inject(WebSocketService) private webSocketService: WebSocketService
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

  public sendGroupedNotification = async (gymId: number): Promise<any> => {
    const notificationsGrouped: any = await this.getAllGrouped(gymId);

    if (!AppUtils.hasValue(notificationsGrouped)) {
      throw new NotFound(
        `cannot send grouped notification because they don't exist`
      );
    }

    const socketID: string = this.cacheService.get(gymId.toString());

    const notificationToSend: AppNotificationMessage = this.createNotification(
      notificationsGrouped,
      gymId
    );

    this.webSocketService.socketIO
      .to(socketID)
      .emit(SocketTopics.TOPIC_GROUPED_NOTIFICATION, notificationToSend);
  };

  private createNotification(
    notificationsGrouped: any,
    gymId: number
  ): AppNotificationMessage {
    const notification = new AppNotificationMessage(
      notificationsGrouped,
      SocketTopics.TOPIC_GROUPED_NOTIFICATION,
      gymId,
      null,
      null,
      new Date()
    );
    return notification;
  }

  public async getAllGrouped(gymId: number): Promise<any[]> {
    const grouped: any[] = [];
    const notifications: any[] =
      await this.appNotificationRepository.getAllGrouped(gymId);

    for (let i = 0; i < notifications.length; i++) {
      const currNotification = notifications[i].dataValues;

      const machine: Machine = await this.machinesRepository.getBySerialNumber(
        currNotification.targetObjectId
      );

      grouped.push({
        machineId: machine.id,
        machineSerialNumber: machine.serialNumber,
        machineName: machine.name,
        notificationsCount: Number(currNotification.cnt),
      });
    }

    return grouped;
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

  public deleteByTargetObjectId = async (
    targetObjectId: string,
    gymId: number
  ): Promise<void> => {
    let transaction: Transaction = null;
    try {
      this.logger.info(
        `Deleting notification with targetObjectId: ${targetObjectId}`
      );

      transaction = await this.appDBConnection.createTransaction();

      await this.appNotificationRepository.deleteByTargetObjectId(
        targetObjectId,
        gymId,
        transaction
      );

      await transaction.commit();

      this.logger.info(
        `Notification with targetObjectId ${targetObjectId} has been deleted.`
      );
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      throw err;
    }
  };
}
