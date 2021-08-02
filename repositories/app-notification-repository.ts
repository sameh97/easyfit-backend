import { inject, injectable } from "inversify";
import { AppNotification } from "../models/app-notification";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { AlreadyExistError } from "../exeptions/already-exist-error";
import { Logger } from "./../common/logger";
import { NotFoundErr } from "../exeptions/not-found-error";

@injectable()
export class AppNotificationRepository {
  constructor(@inject(Logger) private logger: Logger) {}

  public async getAll(gymId: number): Promise<AppNotification[]> {
    return await AppNotification.findAll({ where: { gymId: gymId } });
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
      where: { content: appNotificationMessage.content },
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
}
