import { inject, injectable } from "inversify";
import { AppNotification } from "../models/app-notification";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { AlreadyExistError } from "../exeptions/already-exist-error";
import { Logger } from "./../common/logger";
import { NotFoundErr } from "../exeptions/not-found-error";
import sequelize = require("sequelize");

const { Op } = require("sequelize");
@injectable()
export class AppNotificationRepository {
  constructor(@inject(Logger) private logger: Logger) {}

  public async getAll(gymId: number): Promise<AppNotification[]> {
    return await AppNotification.findAll({ where: { gymId: gymId } });
  }

  public async getByMachineSerialNumber(
    gymId: number,
    machineSerialNumber: string
  ): Promise<AppNotification[]> {
    return await AppNotification.findAll({
      where: { gymId: gymId, targetObjectId: machineSerialNumber, seen: false },
    });
  }

  public save = async (
    appNotificationMessage: AppNotification,
    transaction?: Transaction
  ): Promise<AppNotification> => {
    // const notificationInDB = await AppNotification.findOne({
    //   where: { content: appNotificationMessage.content },
    //   transaction: transaction,
    // });

    // if (AppUtils.hasValue(notificationInDB)) {
    //   throw new AlreadyExistError(
    //     `notification with id ${notificationInDB.id} already exist`
    //   );
    // }

    this.logger.info(
      `Creating notification with id ${appNotificationMessage.id}`
    );

    const createdNotification = await AppNotification.create(
      appNotificationMessage,
      { transaction: transaction }
    );

    return createdNotification;
  };

  public update = async (
    appNotificationMessage: AppNotification,
    transaction?: Transaction
  ): Promise<AppNotification> => {
    let notificationInDB = await AppNotification.findOne({
      where: {
        id: appNotificationMessage.id,
        // content: appNotificationMessage.content,
        // targetObjectId: appNotificationMessage.targetObjectId,
        // gymId: appNotificationMessage.gymId,
      },
      transaction: transaction,
    });

    if (!AppUtils.hasValue(notificationInDB)) {
      throw new NotFoundErr(
        `notification with content ${appNotificationMessage.content} was not fount`
      );
    }

    this.logger.info(
      `Updating notification with content '${appNotificationMessage.content}'`
    );

    // TODO: check if this is a good practice:
    const updatedNotification = await notificationInDB.update(
      appNotificationMessage
    );

    this.logger.info(
      `Updated notification '${JSON.stringify(updatedNotification)}'`
    );

    return updatedNotification;
  };

  public delete = async (
    id: number,
    transaction?: Transaction
  ): Promise<void> => {
    const toDelete: AppNotification = await AppNotification.findOne({
      where: { id: id },
      transaction: transaction,
    });

    if (!AppUtils.hasValue(toDelete)) {
      throw new NotFoundErr(
        `Cannot delete notification: ${id} because it is not found`
      );
    }

    await AppNotification.destroy({
      where: { id: id },
      transaction: transaction,
    });
  };

  public deleteByTargetObjectId = async (
    targetObjectId: string,
    gymId: number,
    transaction?: Transaction
  ): Promise<void> => {
    const toDelete: AppNotification = await AppNotification.findOne({
      where: { [Op.and]: [{ targetObjectId: targetObjectId, gymId: gymId }] },
      transaction: transaction,
    });

    if (!AppUtils.hasValue(toDelete)) {
      // throw new NotFoundErr(
      //   `Cannot delete notification: ${targetObjectId} because it is not found`
      // );
      return;
    }

    await AppNotification.destroy({
      where: { [Op.and]: [{ targetObjectId: targetObjectId, gymId: gymId }] },
      transaction: transaction,
    });
  };

  public getAllGrouped = async (
    gymId: number,
    transaction?: Transaction
  ): Promise<any[]> => {
    // return await AppNotification.findAll({
    //   attributes: [
    //     "AppNotification.*",
    //     [sequelize.fn("count", sequelize.col("AppNotification.*")), "cnt"],
    //   ],
    //   group: "targetObjectId",
    //   where: { gymId: gymId },
    // });
    return await AppNotification.findAll({
      attributes: [
        "targetObjectId",

        [sequelize.fn("COUNT", sequelize.col("targetObjectId")), "cnt"],
      ],
      group: ["targetObjectId"],
      where: { gymId: gymId },
    });
  };
}
