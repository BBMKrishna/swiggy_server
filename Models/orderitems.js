"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Order = require("./order.js");
const Dish = require("./dish.js");
class Orderitems extends Model {}

Orderitems.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize }
);

Order.hasMany(Orderitems, {
  foreignKey: { name: "orderId", allowNull: false },
});
Orderitems.belongsTo(Order, { foreignKey: "orderId" });

Dish.hasMany(Orderitems, {
  foreignKey: { name: "dishId", allowNull: false },
});
Orderitems.belongsTo(Dish, { foreignKey: "dishId" });

const orderitemdbsync = async () => {
  try {
    await Orderitems.sync({ alter: true });
  } catch (error) {
    console.error("Failed to sync - Orderitems", error);
  }
};

orderitemdbsync();

module.exports = Orderitems;
