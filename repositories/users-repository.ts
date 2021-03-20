import { Transaction } from 'sequelize/types';
import { AlreadyExistError } from './../exeptions/already-exist-error';
import { injectable, inject  } from 'inversify';
import { User } from '../models/user';
import { AppUtils } from '../common/app-utils';

@injectable()
export class UsersRepository {
    
    public async save(user: User): Promise<User> {
        const userInDB = await User.findOne({ where: { email: user.email }});
        if (AppUtils.hasValue(userInDB)) {
            throw new AlreadyExistError(`User with mail '${user.email}' already exist`);
        }

        const createdUser = await User.create(user);

        return createdUser;
    }
}
