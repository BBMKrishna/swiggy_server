const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const Restaurant = require("./Models/restaurant.js");
const Dish = require("./Models/dish.js");
const sequelize = require("./sequelize.js");

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
  const restaurant = req.body;
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
      }).then(res.json(data));
    })
    .catch((err) => res.json(err));
});

Restaurant.hasMany(Dish, {
  foreignKey: { name: "restaurantId", allowNull: false },
});
Dish.belongsTo(Restaurant, { foreignKey: "restaurantId" });

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
  Dish.create(req.body)
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
      }).then(() => res.json(data));
    })
    .catch((err) => res.json(err));
});
//express setup at port 3000
app.listen(3000, function (req, res) {
  console.log("server is running at port 3000");
});
