import { inject } from "inversify";
import { User } from "../models/user";
import { UsersRepository } from "../repositories/users-repository";

export class UserService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository
  ) {}

  public async get(user: User): Promise<Boolean> {
    const userInDB = await this.usersRepository.get(user);

    if (!userInDB) {
      return false;
    }

    return true;
  }
}
