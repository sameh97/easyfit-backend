import { injectable } from "inversify";
import * as winston from "winston";

@injectable()
export class Logger {
  constructor() {}
  public logger: winston.Logger = winston.createLogger({
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  });
}
