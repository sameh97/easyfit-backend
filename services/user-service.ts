import { inject, injectable } from "inversify";
import { AuthenticationError } from "../exeptions/authentication-error";
import { User } from "../models/user";
import { UsersRepository } from "../repositories/users-repository";

@injectable ()
export class UserService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository
  ) {}

  public async login(email: string, password: string): Promise<string> {
    const userInDB = await this.usersRepository.getByEmail(email);

    if (userInDB.password !== password) {
      throw new AuthenticationError(`User ${email} not authenticated`);
    }

    return 'sdfklnsdlkfgdfj;g'; // TODO: generate token and return it
  }
}
