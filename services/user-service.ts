import { inject, injectable } from "inversify";
import { AuthenticationError } from "../exeptions/authentication-error";
import { User } from "../models/user";
import { UsersRepository } from "../repositories/users-repository";
import * as jwt from "jsonwebtoken";
import { PasswordManagerService } from "./password-manager-service";
import { Transaction } from "sequelize/types";
import { AppDBConnection } from "../config/database";
import { Console } from "winston/lib/winston/transports";
import { AppUtils } from "../common/app-utils";

@injectable()
export class UserService {
  public static TOKEN_SECRET = "asfwsgvwregwegfrgfwg"; // TODO: use env. variable

  private static readonly TOKEN_EXPIRATION_HOURS = 240;
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(PasswordManagerService) private passwordManager: PasswordManagerService,
    @inject(AppDBConnection) private appDBconnection: AppDBConnection
  ) {}

  public async login(email: string, password: string): Promise<string> {
    const userInDB = await this.usersRepository.getByEmail(email);

    const isPasswordOk = await this.passwordManager.isEqual(password, userInDB.password);
    if (!isPasswordOk) {
      throw new AuthenticationError(`User with ${email} not authenticated`);
    }

    const token = jwt.sign(
      {
        sub: userInDB,
      },
      UserService.TOKEN_SECRET,
      { expiresIn: `${UserService.TOKEN_EXPIRATION_HOURS}h` }
    );

    return token;
  }

  public async create(user: User): Promise<User> {
    let transaction: Transaction = null;
    try {
      const hashedPassword = await this.passwordManager.hashAndSalt(
        user.password
      );

      user.password = hashedPassword;

      transaction = await this.appDBconnection.createTransaction();

      const createdUser = await this.usersRepository.save(user, transaction);

      await transaction.commit();

      return createdUser;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      console.log(`Error while creating user , error: ${AppUtils.getFullException(err)}`);
      throw err;
    }
  }
}
