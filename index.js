require("dotenv").config({ path: ".env" });
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const Restaurant = require("./Models/restaurant.js");
const Dish = require("./Models/dish.js");
const User = require("./Models/user.js");
const Order = require("./Models/order.js");
const Orderitems = require("./Models/orderitems.js");
const { Op } = require("sequelize");
var cors = require("cors");
app.use(cors());

app.post("/signup", async function (req, res) {
  try {
    const data = await User.findOne({
      where: {
        [Op.or]: [{ name: req.body.name }, { phone: req.body.phone }],
      },
    });
    if (data === null) {
      const name = req.body.name;
      const phone = req.body.phone;
      const password = await bcrypt.hash(req.body.password, 10);
      const newUser = await User.create({
        name: name,
        phone: phone,
        password: password,
      });
      return res.json(newUser);
    } else {
      res.status(500).json({
        msg: "User Already Exist, Try to login if you are a Old user",
      });
    }
  } catch {
    res.status(500).json({ msg: "something went wrong!" });
  }
});

app.post("/login", async function (req, res) {
  try {
    const data = await User.findOne({ where: { phone: req.body.phone } });
    if (data === null) {
      res
        .status(500)
        .send({ msg: "user doesnot exists, create a new account" });
    } else {
      const { password } = req.body;
      if (await bcrypt.compare(password, data.password)) {
        const user = { id: data.id };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken: accessToken });
      } else {
        res.json({ msg: "Auth Failed" });
      }
    }
  } catch {
    res.status(500).json({ msg: "something went wrong" });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.use(authenticateToken);
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
    .then(async (data) => {
      await Dish.destroy({
        where: {
          id: req.body.id,
        },
      });
      return data;
    })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

app.get("/users", function (req, res) {
  User.findAll({ where: { id: req.user.id } }).then((data) => {
    res.json(data);
  });
});

app.get("/orders", function (req, res) {
  Order.findAll({ where: { userId: req.user.id } }).then((data) =>
    res.json(data)
  );
});

app.get("/orderitems", function (req, res) {
  Orderitems.findAll().then((data) => res.json(data));
});
app.get("/orders/:orderId/orderitems", function (req, res) {
  Orderitems.findAll({
    where: {
      orderId: parseInt(req.params.orderId),
    },
  }).then((data) => res.json(data));
});

app.post("/orders", function (req, res) {
  Order.create({ userId: req.user.id })
    .then(async (data) => {
      const orderItems = req.body.orderItems;
      for (const orderItem of orderItems) {
        await Orderitems.create({
          quantity: orderItem.quantity,
          orderId: data.dataValues.id,
          dishId: orderItem.id,
          price: orderItem.price,
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
