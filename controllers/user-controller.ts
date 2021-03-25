import { inject, injectable } from "inversify";
import { UserService } from "../services/user-service";
import { User } from "../models/user";
@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  public async get(user: any, res: any): Promise<string> {
    try {
      const userFromBody: User = user;
      const token: string = await this.userService.login(
        userFromBody.email,
        userFromBody.password
      );
      console.log(`the token is: ${token}`);
      return token;
      //res.send(token);
    } catch (e) {
      //res.status(500).send(e.message);
      console.log(e.message);
    }
  }
}
