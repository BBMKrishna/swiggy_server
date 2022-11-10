require("dotenv").config({ path: "../.env" });
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const { Sequelize, Model, DataTypes, Op, INTEGER } = require("sequelize");

const user = "swiggy";
const host = "127.0.0.1";
const database = "swiggy";
const password = process.env.PASSWORD; 
const port = "5432";

//connecting the database
const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: "postgres",
  logging: false,
});

//testing the db connection
const dbAuth = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

dbAuth();

app.listen(3000, function (req, res) {
  console.log("currently its running on 3000");
});
