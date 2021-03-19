const Sequelize = require("sequelize");

class AppDBConnection {
  db;
  constructor() {}
  async connect() {
      this.db = new Sequelize({
          database: 'easy_fit',
          dialect: 'postgres',
          username: 'postgres',
          password: 'postgres',
          host: 'localhost',
          port: 5432
      });
      await this.db.authenticate();
      await this.db.sync();
  }
}

module.exports = new AppDBConnection();
