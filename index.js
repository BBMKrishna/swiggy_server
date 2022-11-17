const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const Restaurant = require("./Models/restaurant.js");
const Dish = require("./Models/dish.js");
const User = require("./Models/user.js");
const md5 = require("md5");
// restaurant routes
app.post("/restaurants", function (req, res) {
  Restaurant.create(req.body)
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
      return Dish.destroy({
        where: {
          id: req.body.id,
        },
      }).then(() => data);
    })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

app.get("/users", function (req, res) {
  User.findAll().then((data) => res.json(data));
});

app.post("/signup", function (req, res) {
  const { name, phoneNum, password } = req.body;
  User.create({ name: name, phone: phone, password: md5(password) })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

//express setup at port 3000
app.listen(3000, function (req, res) {
  console.log("server is running at port 3000");
});
