'use strict';
const { sequelize } = require('../sequelize/db');
const { Model, DataTypes } = require('sequelize');

class Customers extends Model {}

Customers.init(
  {
    userId: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },

    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneLandline: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    phoneMobile: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    emailPri: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    emailSec: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    addressLine1: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    addressLine2: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    addressLine3: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    country: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
  },
  {
    sequelize,
    modelName: 'Customers',
    timestamps: true,
  },
);

Customers.sync();

module.exports = Customers;
