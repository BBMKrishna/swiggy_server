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

module.exports = Dish;
