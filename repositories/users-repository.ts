import { Transaction } from "sequelize/types";
import { AlreadyExistError } from "./../exeptions/already-exist-error";
import { inject, injectable } from "inversify";
import { User } from "../models/user";
import { AppUtils } from "../common/app-utils";
import { UserNotFoundErr } from "../exeptions/user-not-found-error";
import { NotFoundErr } from "../exeptions/not-found-error";
import { Logger } from "../common/logger";

@injectable()
export class UsersRepository {
  constructor(@inject(Logger) private logger: Logger) {}

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
      throw new NotFoundErr(`User with mail ${email} does not exist`);
    }

    return userInDB;
  }

  public async getAll(): Promise<User[]> {
    return await User.findAll({});
  }

  public update = async (
    user: User,
    transaction?: Transaction
  ): Promise<User> => {
    let userInDB = await User.findOne({
      where: { id: user.id },
      transaction: transaction,
    });

    if (!AppUtils.hasValue(userInDB)) {
      throw new NotFoundErr(`User with id ${user.id} was not fount`);
    }

    this.logger.info(`Updating user with id '${user.id}'`);

    const updatedUser = await userInDB.update(user);

    this.logger.info(`Updated user '${JSON.stringify(updatedUser)}'`);

    return updatedUser;
  };

  public delete = async (
    id: number,
    transaction?: Transaction
  ): Promise<void> => {
    const toDelete: User = await User.findOne({
      where: { id: id },
      transaction: transaction,
    });

    if (!AppUtils.hasValue(toDelete)) {
      throw new NotFoundErr(
        `Cannot delete user: ${id} because it is not found`
      );
    }

    await User.destroy({
      where: { id: id },
      transaction: transaction,
    });
  };
}
