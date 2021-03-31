import { inject, injectable } from "inversify";
import { UserService } from "../services/user-service";
import { User } from "../models/user";
import { DtoMapper } from "../common/dto-mapper";
import { Logger } from "./../common/logger";
import { AppUtils } from "../common/app-utils";

@injectable()
export class UserController {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(DtoMapper) private dtoMapper: DtoMapper,
    @inject(Logger) private logger: Logger
  ) {}

  public login = async (req: any, res: any, next: any) => {
    let userFromBody: User = null;
    try {
      userFromBody = req.body;
      const token: string = await this.userService.login(
        userFromBody.email,
        userFromBody.password
      );
      res.setHeader("Authorization", token);
      res.send({});
    } catch (e) {
      const email = AppUtils.hasValue(userFromBody) ? userFromBody.email : '';
      this.logger.error(`Cannot login user: ${email}`, e);
      next(e);
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
      this.logger.error(`Cannot create user: ${JSON.stringify(userToCreate)}`, err);
      next(err);
    }
  };
}
