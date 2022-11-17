require("dotenv").config({ path: ".env" });
const user = process.env.user;
const host = process.env.host;
const database = process.env.database;
const password = process.env.password;
const port = process.env.post;
const { Sequelize } = require("sequelize");
//connecting the database
const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;
