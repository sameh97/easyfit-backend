import { inject, injectable } from "inversify";
import { AuthenticationError } from "../exeptions/authentication-error";
import { User } from "../models/user";
import { UsersRepository } from "../repositories/users-repository";
import * as jwt from "jsonwebtoken";
import { PasswordManagerService } from "./password-manager-service";
import { Transaction } from "sequelize/types";
import { AppDBConnection } from "../config/database";

@injectable()
export class UserService {
  public static TOKEN_SECRET = "asfwsgvwregwegfrgfwg"; // TODO: use env. variable
  // private static readonly TOKEN_EXPIRATION_SECS = 864000;
  private static readonly TOKEN_EXPIRATION_HOURS = 240;
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(PasswordManagerService)
    private passwordManager: PasswordManagerService,
    @inject(AppDBConnection) private appDBconnection: AppDBConnection
  ) {}

  public async login(email: string, password: string): Promise<string> {
    const userInDB = await this.usersRepository.getByEmail(email);

    if (userInDB.password !== password) {
      throw new AuthenticationError(`User ${email} not authenticated`);
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
      throw err;
    }
  }
}
