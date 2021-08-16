import { inject, injectable } from "inversify";
import { MemberDtoMapper } from "../common/dto-mapper/member-dto-mapper";
import { NotificationsDtoMapper } from "../common/dto-mapper/notifications-dto-mapper";
import { Logger } from "../common/logger";
import { AppNotification } from "../models/app-notification";
import { MemberDto } from "../models/dto/member-dto";
import { AppNotificationDto } from "../models/dto/notifications-dto";
import { Member } from "../models/member";
import { AppNotificationService } from "../services/app-notification-service";
import { MembersService } from "../services/members-service";

@injectable()
export class AppNotificationsController {
  constructor(
    @inject(AppNotificationService)
    private appNotificationService: AppNotificationService,
    @inject(NotificationsDtoMapper)
    private notificationsDtoMapper: NotificationsDtoMapper,
    @inject(Logger) private logger: Logger
  ) {}

  public getAll = async (req: any, res: any, next: any) => {
    try {
      const notifications: AppNotification[] =
        await this.appNotificationService.getAll(req.query.gymId);

      const notificationsDto: AppNotificationDto[] = notifications.map(
        (notification) => this.notificationsDtoMapper.asDto(notification)
      );

      next(notificationsDto);
    } catch (err) {
      this.logger.error(`cannot get all notifications`, err);
      next(err);
    }
  };

  public getByMachineSerialNumber = async (req: any, res: any, next: any) => {
    try {
      const notifications: AppNotification[] =
        await this.appNotificationService.getByMachineSerialNumber(
          req.query.gymId,
          req.query.machineSerialNumber
        );

      const notificationsDto: AppNotificationDto[] = notifications.map(
        (notification) => this.notificationsDtoMapper.asDto(notification)
      );

      next(notificationsDto);
    } catch (err) {
      this.logger.error(`cannot get all notifications`, err);
      next(err);
    }
  };

  // public create = async (req: any, res: any, next: any) => {
  //   let memberToCreate: Member = null;
  //   try {
  //     memberToCreate = this.membersDtoMapper.asEntity(req.body);

  //     const createdMember: Member = await this.membersService.create(
  //       memberToCreate
  //     );

  //     res.status(201);

  //     next(this.membersDtoMapper.asDto(createdMember));
  //   } catch (err) {
  //     this.logger.error(
  //       `Cannot create member ${JSON.stringify(req.body)}`,
  //       err
  //     );
  //     next(err);
  //   }
  // };

  public update = async (req: any, res: any, next: any) => {
    let notificationToUpdate: AppNotification = null;
    try {
      notificationToUpdate = this.notificationsDtoMapper.asEntity(req.body);

      const updatedNotification: AppNotification =
        await this.appNotificationService.update(notificationToUpdate);

      res.status(201);

      next(this.notificationsDtoMapper.asDto(updatedNotification));
    } catch (err) {
      this.logger.error(
        `Cannot update notification ${JSON.stringify(req.body)}`,
        err
      );
      next(err);
    }
  };

  public delete = async (req: any, res: any, next: any) => {
    let notificationId: number;
    try {
      notificationId = Number(req.query.id);

      await this.appNotificationService.delete(notificationId);

      next(
        `notification with id ${notificationId} has been deleted succesfuly`
      );
    } catch (err) {
      this.logger.error(`Cannot delete notification: ${notificationId}`, err);
      next(err);
    }
  };
}
