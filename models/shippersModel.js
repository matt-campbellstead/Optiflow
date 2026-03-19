'use strict';
const { sequelize } = require('../sequelize/db');
const { Model, DataTypes } = require('sequelize');
//const Master = require('./masterModel');

class Shippers extends Model {}

Shippers.init(
  {
    companyName: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    contactName: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    phoneLandline: {
      type: DataTypes.STRING,
      // validate: {
      //   isNumeric: true,
      // },
    },
    phoneMobile: {
      type: DataTypes.STRING,
      // validate: {
      //   isNumeric: true,
      // },
    },
    emailPrimary: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    emailSecondary: {
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
        is: /^[a-zA-Z0-9\s]*$/i, // Space for custom validator?
      },
    },
  },
  {
    sequelize,
    modelName: 'Shippers',
    timestamps: false,
  },
);

Shippers.sync();

module.exports = Shippers;
