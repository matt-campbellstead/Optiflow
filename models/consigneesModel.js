'use strict';
const { sequelize } = require('../sequelize/db');
const { Model, DataTypes } = require('sequelize');

class Consignees extends Model {}

Consignees.init(
  {
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
  { sequelize, modelName: 'Consignees', timestamps: true },
);

Consignees.sync();

module.exports = Consignees;
