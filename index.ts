import "reflect-metadata";
import { EasyFitApp } from "./server/server";
import { AppDBConnection } from "./config/database";
import container from "./inversify.config";
import { Logger } from "./common/logger";
const app = new EasyFitApp(
  container.get(AppDBConnection),
  container.get(Logger)
);

app.start();

console.log(`---  EASYFIT APP SERVICE ---`);
