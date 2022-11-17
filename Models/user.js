"use strict";
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNum: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "You must enter Phone Number" },
        len: { args: [10, 10], msg: "Phone Number is invalid" },
        isInt: { args: true, msg: "You must enter Phone Number" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize }
);

const UserSync = async () => {
  try {
    await User.sync({ alter: true });
  } catch (error) {
    console.error("Failed to sync - User", error);
  }
};

UserSync();

module.exports = User;
