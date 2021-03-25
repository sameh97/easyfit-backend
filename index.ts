import "reflect-metadata";
import { EasyFitApp } from "./server/server";
import { AppDBConnection } from "./config/database";
import container from "./inversify.config";

const app = new EasyFitApp(container.get(AppDBConnection));

app.start();

console.log(`---  EASYFIT APP SERVICE ---`);
