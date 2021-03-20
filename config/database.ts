import { Sequelize } from "sequelize/types";
// const Sequelize = require("sequelize");

export class AppDBConnection {
  private db: Sequelize;

  async connect(): Promise<void> {
    this.db = new Sequelize({
      database: "easy_fit",
      dialect: "postgres",
      username: "postgres",
      password: "postgres",
      host: "localhost",
      port: 5432,
    });
    await this.db.authenticate();
    await this.db.sync();
  }
}

module.exports = new AppDBConnection();
