import { Container } from 'inversify';
import { AppDBConnection } from './config/database';
import { UserController } from './controllers/user-controller';
import { UsersRepository } from './repositories/users-repository';
import { UserService } from './services/user-service';

// TODO: improve the container, it should use types

const container = new Container({ defaultScope: 'Singleton' });

container.bind<AppDBConnection>(AppDBConnection).toSelf();
container.bind<UserService>(UserService).toSelf();
container.bind<UserController>(UserController).toSelf();
container.bind<UsersRepository>(UsersRepository).toSelf();

export default container;
