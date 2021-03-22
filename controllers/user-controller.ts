import { inject, injectable } from "inversify";
import { UserService } from "../services/user-service";
import { User } from "../models/user";
@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  public get = async (req: any, res: any) => {
    try {
      const userFromBody: User = req.body;
      const token: string = await this.userService.login(userFromBody.email, userFromBody.password);
      res.send(token);
    } catch(e) {
      res.status(500).send(e.message);
    }
  };
}
