import { inject, injectable } from "inversify";
import { UserService } from "../services/user-service";
import { User } from "../models/user";
import { DtoMapper } from "../common/dto-mapper";
import { Logger } from "./../common/logger";
import { AppUtils } from "../common/app-utils";
import { UserDto } from "../models/dto/user-dto";
const { logInSchema } = require("./../common/validation");

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

      // const result = await logInSchema.validateAsync(userFromBody);

      const token: string = await this.userService.login(
        userFromBody.email,
        userFromBody.password
      );
      res.setHeader("Authorization", token);
      res.send({});
    } catch (e) {
      const email = AppUtils.hasValue(userFromBody) ? userFromBody.email : "";
      this.logger.error(`Cannot login user: ${email}`, e);
      next(e);
    }
  };

  public createUser = async (req: any, res: any, next: any) => {
    let userToCreate: User = null;
    try {
      userToCreate = this.dtoMapper.asEntity(req.body);

      const createdUser: User = await this.userService.create(userToCreate);

      res.status(201);
      next(this.dtoMapper.asDto(createdUser));
    } catch (err) {
      this.logger.error(
        `Cannot create user: ${JSON.stringify(userToCreate)}`,
        err
      );
      next(err);
    }
  };

  public getAll = async (req: any, res: any, next: any) => {
    try {
      const users: User[] = await this.userService.getAll();

      const usersDto: UserDto[] = users.map((user) =>
        this.dtoMapper.asDto(user)
      );

      next(usersDto);
    } catch (err) {
      this.logger.error(`cannot get all users`, err);
      next(err);
    }
  };

  public update = async (req: any, res: any, next: any) => {
    let userToUpdate: User = null;
    try {
      userToUpdate = this.dtoMapper.asEntity(req.body);

      const updatedUser: User = await this.userService.update(userToUpdate);

      res.status(201);

      next(this.dtoMapper.asDto(updatedUser));
    } catch (err) {
      this.logger.error(`Cannot update user ${JSON.stringify(req.body)}`, err);
      next(err);
    }
  };

  public delete = async (req: any, res: any, next: any) => {
    let userId: number;
    try {
      userId = Number(req.query.id);

      await this.userService.delete(userId);

      next(`user with id ${userId} has been deleted succesfuly`);
    } catch (err) {
      this.logger.error(`Cannot delete user: ${userId}`, err);
      next(err);
    }
  };
}
