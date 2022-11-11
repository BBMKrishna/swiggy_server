require("dotenv").config({ path: ".env" });
const { Sequelize, Model, DataTypes } = require("sequelize");
const user = process.env.user;
const host = process.env.host;
const database = process.env.database;
const password = process.env.password;
const port = process.env.post;

//connecting the database
const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: "postgres",
  logging: false,
});

//restaurants schema
class Restaurant extends Model {}

Restaurant.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "swiggy" }
);

//db synchronization

const dbsync = async () => {
  try {
    await Restaurant.sync({ alter: true });
  } catch (error) {
    console.error("Failed to sync", error);
  }
};

dbsync();

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
