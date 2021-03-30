import { inject, injectable } from "inversify";
import { UserService } from "../services/user-service";
import { User } from "../models/user";
import { DtoMapper } from "../common/dto-mapper";
import { Logger } from "./../common/logger";

@injectable()
export class UserController {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(DtoMapper) private dtoMapper: DtoMapper,
    @inject(Logger) private logger: Logger
  ) {}

  public async get(user: any, res: any): Promise<string> {
    try {
      const userFromBody: User = user;
      const token: string = await this.userService.login(
        userFromBody.email,
        userFromBody.password
      );
      return token;
    } catch (e) {
      console.log(e.message);
    }
  }

  public createUser = async (req: any, res: any, next: any) => {
    let userToCreate: User = null;
    try {
      userToCreate = this.dtoMapper.asEntity(req.body);
      const createdUser: User = await this.userService.create(userToCreate);

      res.status(201);
      next(this.dtoMapper.asDto(createdUser));
    } catch (err) {
      //   this.logger.error(`Cannot create user: ${JSON.stringify(userToCreate)}`);
      this.logger.logger.log({
        level: "error",
        message: `Cannot create user: ${JSON.stringify(userToCreate)}`,
      });

      next(err);
    }
  };
}
