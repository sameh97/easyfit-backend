import "reflect-metadata";
import { EasyFitApp } from "./server/server";
import { AppDBConnection } from "./config/database";

const app = new EasyFitApp(new AppDBConnection());

app.start();
