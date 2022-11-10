require("dotenv").config({path:".env"});


const { Sequelize} = require("sequelize");

const user = process.env.user;
const host = process.env.host;
const database = process.env.database;
const password = process.env.PASSWORD; 
const port = process.env.post;

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

