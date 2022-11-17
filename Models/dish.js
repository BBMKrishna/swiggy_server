"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

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

const dishDbSync = async () => {
  try {
    await Dish.sync({ alter: true });
  } catch (error) {
    console.error("Failed to sync", error);
  }
};

dishDbSync();

module.exports = Dish;
