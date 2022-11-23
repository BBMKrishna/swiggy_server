"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Restaurant = require("./restaurant.js");
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

Restaurant.hasMany(Dish, {
  foreignKey: { name: "restaurantId", allowNull: false },
});
Dish.belongsTo(Restaurant, { foreignKey: "restaurantId" });

const dishDbSync = async () => {
  try {
    await Dish.sync({ alter: true });
  } catch (error) {
    console.error("Failed to sync - Dish", error);
  }
};

dishDbSync();

module.exports = Dish;
