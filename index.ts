import "reflect-metadata";
import { EasyFitApp } from "./server/server";
import { AppDBConnection } from "./config/database";
import container from "./inversify.config";
import { Logger } from "./common/logger";
import { UsersApi } from "./routes/users.api";

const app = new EasyFitApp(
  container.get(UsersApi),
  container.get(AppDBConnection),
  container.get(Logger)
);

app.start();

console.log(`---  EASYFIT APP SERVICE ---`);
