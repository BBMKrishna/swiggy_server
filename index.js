const express = require("express");
const app = express();
app.use(express.json());
const Restaurant = require("./Models/restaurant.js");
const Dish = require("./Models/dish.js");
const User = require("./Models/user.js");
const Order = require("./Models/order.js");
const Orderitems = require("./Models/orderitems.js");
const md5 = require("md5");
var cors = require("cors");
app.use(cors());
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

app.get("/restaurants/:restaurantId/dishes", function (req, res) {
  
  Dish.findAll({
    where: {
      restaurantId: parseInt(req.params.restaurantId),
    },
  }).then((data) => res.json(data));
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
  const { name, phone, password } = req.body;
  User.create({ name: name, phone: phone, password: md5(password) })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

app.post("/login", function (req, res) {
  const { phone, password } = req.body;
  User.findOne({ where: { phone: phone } })
    .then((data) => {
      if (data.password === md5(password)) {
        res.json(data);
      } else {
        res.status(401).json({ msg: "Auth Failed" });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});
app.get("/orders", function (req, res) {
  Order.findAll().then((data) => res.json(data));
});

app.post("/orders", function (req, res) {
  Order.create(req.body)
    .then(async (data) => {
      const orderItems = req.body.orderItems;
      for (const orderItem of orderItems) {
        await Orderitems.create({
          quantity: orderItem.quantity,
          orderId: data.dataValues.id,
          dishId: orderItem.dishId,
        });
      }
      res.json(data);
    })
    .catch((err) => res.json(err));
});
//express setup at port 3000
app.listen(3080, function (req, res) {
  console.log("server is running at port 3080");
});
