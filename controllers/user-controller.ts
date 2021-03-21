import { inject, injectable } from "inversify";
import { UserService } from "../services/user-service";
import { User } from "../models/user";
@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}
  public get = async (req: any, res: any) => {
    const userExist: Boolean = await this.userService.get(req.body);

    if (!userExist) {
      res.send(`user with email: ${req.body.email} 
                    does not exist!`);
    }
    res.send(`welcome to our website!`);
  };
}
