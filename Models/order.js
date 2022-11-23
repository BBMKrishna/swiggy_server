"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const User = require("./user.js");
class Order extends Model {}

Order.init({}, { sequelize });

User.hasMany(Order, { foreignKey: "userId", allowNull: false });
Order.belongsTo(User, { foreignKey: "userId" });
const orderdbsync = async () => {
  try {
    await Order.sync({ alter: true });
  } catch (error) {
    console.error("Failed to sync - order", error);
  }
};
orderdbsync();

module.exports = Order;
