require("dotenv").config({ path: ".env" });
const argon2 = require("argon2");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
var cors = require("cors");
app.use(cors());
const prisma = require('./prisma/client');

app.post("/signup", async function (req, res) {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { name: req.body.name },
          { phone: req.body.phone }
        ]
      }
    });

    if (!existingUser) {
      const password = await argon2.hash(req.body.password);
      const newUser = await prisma.user.create({
        data: {
          name: req.body.name,
          phone: req.body.phone,
          password: password,
        },
      });
      return res.json(newUser);
    } else {
      res.status(500).json({
        msg: "User Already Exists, Try to login if you are an Old user",
      });
    }
  } catch (error) {
    res.status(500).json({ msg: "something went wrong!" });
  }
});

app.post("/login", async function (req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { phone: req.body.phone }
    });

    if (!user) {
      return res.status(500).send({ msg: "user does not exist, create a new account" });
    }

    if (await argon2.verify(user.password, req.body.password)) {
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET);
      res.json({
        accessToken: accessToken,
        userId: user.id
      });
    } else {
      res.json({ msg: "Auth Failed" });
    }
  } catch (error) {
    res.status(500).json({ msg: "something went wrong" });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  });
}

app.use(authenticateToken);

// restaurant routes
app.post("/restaurants", async function (req, res) {
  try {
    const restaurant = await prisma.restaurant.create({
      data: req.body
    });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: "Failed to create restaurant" });
  }
});

app.get("/restaurants", async function (req, res) {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

app.delete("/restaurants", async function (req, res) {
  try {
    const restaurant = await prisma.restaurant.delete({
      where: { id: req.body.id }
    });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete restaurant" });
  }
});

app.get("/dishes", async function (req, res) {
  try {
    const dishes = await prisma.dish.findMany();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dishes" });
  }
});

app.get("/restaurants/:restaurantId/dishes", async function (req, res) {
  try {
    const dishes = await prisma.dish.findMany({
      where: {
        restaurantId: parseInt(req.params.restaurantId)
      }
    });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant dishes" });
  }
});

app.post("/dishes", async function (req, res) {
  try {
    const dish = await prisma.dish.create({
      data: req.body
    });
    res.json(dish);
  } catch (error) {
    res.status(500).json({ error: "Failed to create dish" });
  }
});

app.delete("/dishes", async function (req, res) {
  try {
    const dish = await prisma.dish.delete({
      where: { id: req.body.id }
    });
    res.json(dish);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete dish" });
  }
});

app.get("/users", async function (req, res) {
  try {
    const users = await prisma.user.findMany({
      where: { id: req.user.id }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/orders", async function (req, res) {
  try {
    console.log("User ID from token:", req.userId);

    const orders = await prisma.order.findMany({
      where: {
        userId: req.userId
      },
      include: {
        orderItems: {
          include: {
            dish: true
          }
        }
      }
    });

    console.log("Found orders:", orders);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/orderitems", async function (req, res) {
  try {
    const orderItems = await prisma.orderItems.findMany();
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order items" });
  }
});

app.get("/orders/:orderId/orderitems", async function (req, res) {
  try {
    const orderItems = await prisma.orderItems.findMany({
      where: {
        orderId: parseInt(req.params.orderId)
      }
    });
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order items" });
  }
});

app.post("/orders", async function (req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    const orderItems = req.body.orderItems;
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ error: "Invalid order items" });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        orderItems: {
          create: orderItems.map(item => ({
            quantity: item.quantity,
            price: item.price,
            dishId: item.id
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.listen(3080, function () {
  console.log("server is running at port 3080");
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
