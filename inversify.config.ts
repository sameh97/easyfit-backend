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
export default container;
