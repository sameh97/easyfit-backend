import { inject, injectable } from "inversify";
import { AuthenticationError } from "../exeptions/authentication-error";
import { User } from "../models/user";
import { UsersRepository } from "../repositories/users-repository";
import * as jwt from "jsonwebtoken";

@injectable()
export class UserService {
  public static TOKEN_SECRET = "asfwsgvwregwegfrgfwg"; // TODO: use env. variable
  // private static readonly TOKEN_EXPIRATION_SECS = 864000;
  private static readonly TOKEN_EXPIRATION_HOURS = 240;
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository
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
}
