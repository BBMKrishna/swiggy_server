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
// const { defaultValueSchemable } = require("sequelize/types/utils");
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
  { sequelize }
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
app.post("/restaurants", function (req, res) {
  const { name, address, city } = req.body;
  const restaurant = {
    name: name,
    address: address,
    city: city,
  };
  Restaurant.create(restaurant)
    .then((data) => res.json(data))
    .catch((error) => console.error("Failed to create a record", error));
});

app.get("/restaurants", function (req, res) {
  Restaurant.findAll().then((restaurants) => res.json(restaurants));
});
app.delete("/restaurants", function (req, res) {
  Restaurant.findOne({
    where: {
      id: req.body.id,
    },
  })
    .then((data) => {
      Restaurant.destroy({
        where: {
          id: req.body.id,
        },
      })
        .then(res.json(`deleted the below record successfully ${data}`))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});

class Dish extends Model {}

Dish.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nonVeg: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  { sequelize }
);

Restaurant.hasMany(Dish, { foreignKey: { allowNull: false } });
Dish.belongsTo(Restaurant);

const dishDbSync = async () => {
  try {
    await Dish.sync({ alter: true });
  } catch (error) {
    console.error("Failed to sync", error);
  }
};

dishDbSync();

app.get("/dishes", function (req, res) {
  Dish.findAll().then((data) => res.json(data));
});

app.post("/dishes", function (req, res) {
  const { name, price, nonVeg, restaurantId } = req.body;
  Dish.create({
    name: name,
    price: price,
    nonVeg: nonVeg,
    RestaurantId: restaurantId,
  })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});
app.delete("/dishes", function (req, res) {
  Dish.findOne({
    where: {
      id: req.body.id,
    },
  })
    .then((data) => {
      Dish.destroy({
        where: {
          id: req.body.id,
        },
      })
        .then(res.json(data))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});
//express setup at port 3000
app.listen(3000, function (req, res) {
  console.log("server is running at port 3000");
});
