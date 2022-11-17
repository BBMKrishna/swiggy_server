"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Dish = require("./dish.js");
class Restaurant extends Model {}

Restaurant.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize }
);
const dbsync = async () => {
  try {
    await Restaurant.sync({ alter: true });
  } catch (error) {
    console.error("Failed to sync - Restaurant", error);
  }
};

dbsync();

Restaurant.hasMany(Dish, {
  foreignKey: { name: "restaurantId", allowNull: false },
});
Dish.belongsTo(Restaurant, { foreignKey: "restaurantId" });

module.exports = Restaurant;
