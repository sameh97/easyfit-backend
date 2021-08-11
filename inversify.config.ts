import { Container } from "inversify";
import { AppDBConnection } from "./config/database";
import { UserController } from "./controllers/user-controller";
import { UsersRepository } from "./repositories/users-repository";
import { UserService } from "./services/user-service";
import { Logger } from "./common/logger";
import { DtoMapper } from "./common/dto-mapper";
import { UsersApi } from "./routes/users.api";
import { PasswordManagerService } from "./services/password-manager-service";
import { MembersService } from "./services/members-service";
import { MemberDtoMapper } from "./common/dto-mapper/member-dto-mapper";
import { MemebrsController } from "./controllers/members-controller";
import { MembersRepository } from "./repositories/members-repository";
import { GymRepository } from "./repositories/gym-repository";
import { GymController } from "./controllers/gym-controller";
import { GymService } from "./services/gym-service";
import { MembersApi } from "./routes/members.api";
import { GymApi } from "./routes/gym.api";
import { GymDtoMapper } from "./common/dto-mapper/gym-dto-mapper";
import { TrainerRepository } from "./repositories/trainer-repository";
import { TrainerDtoMapper } from "./common/dto-mapper/trainer-dto-mapper";
import { TrainerController } from "./controllers/trainer-controller";
import { TrainerService } from "./services/trainer-service";
import { TrainersApi } from "./routes/trainers.api";
import { ProductsRepository } from "./repositories/products-repository";
import { ProductsService } from "./services/products-service";
import { ProductsController } from "./controllers/products-controller";
import { ProductsApi } from "./routes/products.api";
import { ProductDtoMapper } from "./common/dto-mapper/products-dto-mapper";
import { MachinesRepository } from "./repositories/machine-repository";
import { MachinesService } from "./services/machines-service";
import { MachinesController } from "./controllers/machines-controller";
import { MachinesApi } from "./routes/machines.api";
import { MachineDtoMapper } from "./common/dto-mapper/machine-dto-mapper";
import { MachineSchedulerService } from "./services/scheduler-service";
import { MachineSchedulerRepository } from "./repositories/scheduler-repository";
import { MachineSchedulerController } from "./controllers/scheduler-controller";
import { MachineScheduleDtoMapper } from "./common/dto-mapper/scheduler-dto-mapper";
import { JobScheduleManager } from "./services/scheduler-manager";
import { MachineSchedulerApi } from "./routes/scheduler.api";
import { JobService } from "./services/job-service";
import { WebSocketService } from "./services/socket.io-service";
import { CacheService } from "./services/cache-service";
import { AppNotification } from "./models/app-notification";
import { AppNotificationRepository } from "./repositories/app-notification-repository";
import { AppNotificationService } from "./services/app-notification-service";
import { AppNotificationsController } from "./controllers/notifications-controller";
import { NotificationsApi } from "./routes/notification";
import { NotificationsDtoMapper } from "./common/dto-mapper/notifications-dto-mapper";
// TODO: improve the container, it should use types

const container = new Container({ defaultScope: "Singleton" });

container.bind<AppDBConnection>(AppDBConnection).toSelf();
container.bind<UserService>(UserService).toSelf();
container.bind<UserController>(UserController).toSelf();
container.bind<UsersRepository>(UsersRepository).toSelf();
container.bind<Logger>(Logger).toSelf();
container.bind<DtoMapper>(DtoMapper).toSelf();
container.bind<UsersApi>(UsersApi).toSelf();
container.bind<PasswordManagerService>(PasswordManagerService).toSelf();
container.bind<MembersService>(MembersService).toSelf();
container.bind<MemebrsController>(MemebrsController).toSelf();
container.bind<MembersRepository>(MembersRepository).toSelf();
container.bind<MemberDtoMapper>(MemberDtoMapper).toSelf();
container.bind<MembersApi>(MembersApi).toSelf();
container.bind<GymRepository>(GymRepository).toSelf();
container.bind<GymController>(GymController).toSelf();
container.bind<GymService>(GymService).toSelf();
container.bind<GymApi>(GymApi).toSelf();
container.bind<GymDtoMapper>(GymDtoMapper).toSelf();
container.bind<TrainerRepository>(TrainerRepository).toSelf();
container.bind<TrainerDtoMapper>(TrainerDtoMapper).toSelf();
container.bind<TrainerController>(TrainerController).toSelf();
container.bind<TrainerService>(TrainerService).toSelf();
container.bind<TrainersApi>(TrainersApi).toSelf();
container.bind<ProductsRepository>(ProductsRepository).toSelf();
container.bind<ProductsService>(ProductsService).toSelf();
container.bind<ProductsController>(ProductsController).toSelf();
container.bind<ProductsApi>(ProductsApi).toSelf();
container.bind<ProductDtoMapper>(ProductDtoMapper).toSelf();
container.bind<MachinesRepository>(MachinesRepository).toSelf();
container.bind<MachinesService>(MachinesService).toSelf();
container.bind<MachinesController>(MachinesController).toSelf();
container.bind<MachinesApi>(MachinesApi).toSelf();
container.bind<MachineDtoMapper>(MachineDtoMapper).toSelf();

container.bind<MachineSchedulerService>(MachineSchedulerService).toSelf();
container.bind<MachineSchedulerRepository>(MachineSchedulerRepository).toSelf();
container.bind<MachineSchedulerController>(MachineSchedulerController).toSelf();
container.bind<MachineScheduleDtoMapper>(MachineScheduleDtoMapper).toSelf();
container.bind<JobScheduleManager>(JobScheduleManager).toSelf();
container.bind<MachineSchedulerApi>(MachineSchedulerApi).toSelf();

container.bind<JobService>(JobService).toSelf();
container.bind<WebSocketService>(WebSocketService).toSelf();
container.bind<CacheService>(CacheService).toSelf();

container.bind<AppNotification>(AppNotification).toSelf();
container.bind<AppNotificationRepository>(AppNotificationRepository).toSelf();
container.bind<AppNotificationService>(AppNotificationService).toSelf();
container.bind<AppNotificationsController>(AppNotificationsController).toSelf();
container.bind<NotificationsDtoMapper>(NotificationsDtoMapper).toSelf();
container.bind<NotificationsApi>(NotificationsApi).toSelf();
export default container;
