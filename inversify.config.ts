import { Container } from "inversify";
import { AppDBConnection } from "./config/database";
import { UserController } from "./controllers/user-controller";
import { UsersRepository } from "./repositories/users-repository";
import { UserService } from "./services/user-service";
import { Logger } from "./common/logger";
import { DtoMapper } from "./common/dto-mapper";

// TODO: improve the container, it should use types

const container = new Container({ defaultScope: "Singleton" });

container.bind<AppDBConnection>(AppDBConnection).toSelf();
container.bind<UserService>(UserService).toSelf();
container.bind<UserController>(UserController).toSelf();
container.bind<UsersRepository>(UsersRepository).toSelf();
container.bind<Logger>(Logger).toSelf();
container.bind<DtoMapper>(DtoMapper).toSelf();

export default container;
