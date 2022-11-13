require("dotenv").config({ path: ".env" });
const { Sequelize, Model, DataTypes } = require("sequelize");
const user = process.env.user;
const host = process.env.host;
const database = process.env.database;
const password = process.env.password;
const port = process.env.post;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

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

// restaurant routes
app
  .route("/restaurant")
  .post(function (req, res) {
    const { rName, rAddress, rCity } = req.body;
    Restaurant.create({
      name: rName,
      address: rAddress,
      city: rCity,
    });
    res.redirect("/restaurant");
  })
  .get(function (req, res) {
    const searchRestaurant = async () => {
      const restaurants = await Restaurant.findAll();
      res.json(restaurants);
    };
    searchRestaurant();
  })
  .delete(function (req, res) {
    const delRestaurant = async () => {
      Restaurant.destroy({
        where: {
          id: req.body.id,
        },
      });
    };
    delRestaurant();
  });

//express setup at port 3000
app.listen(3000, function (req, res) {
  console.log("server is running at port 3000");
});
