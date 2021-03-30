import { Transaction } from "sequelize/types";
import { AlreadyExistError } from "./../exeptions/already-exist-error";
import { injectable } from "inversify";
import { User } from "../models/user";
import { AppUtils } from "../common/app-utils";
import { UserNotFoundErr } from "../exeptions/user-not-found-error";

@injectable()
export class UsersRepository {
  public async save(user: User, transaction?: Transaction): Promise<User> {
    const userInDB = await User.findOne({
      where: { email: user.email },
      transaction: transaction,
    });
    if (AppUtils.hasValue(userInDB)) {
      throw new AlreadyExistError(
        `User with mail '${user.email}' already exist`
      );
    }

    const createdUser = await User.create(user, { transaction: transaction });

    return createdUser;
  }

  // function that checks user when login occurs:
  public async getByEmail(email: string): Promise<User> {
    const userInDB = await User.findOne({ where: { email: email } });
    if (!AppUtils.hasValue(userInDB)) {
      throw new UserNotFoundErr(`User with mail ${email} does not exist`);
    }

    return userInDB;
  }
}
