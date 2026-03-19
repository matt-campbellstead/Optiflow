'use strict';
const { sequelize } = require('../sequelize/db');
const { Model, DataTypes } = require('sequelize');

class Financials extends Model {}

Financials.init(
  {
    shipperInvoiceNum: {
      type: DataTypes.STRING,
      validate: {
        isUppercase: true,
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    invoiceDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    invoiceAmount: {
      type: DataTypes.STRING, //???
    },
    currency: {
      type: DataTypes.STRING,
      validate: {
        isUppercase: true,
        is: /^[a-zA-Z0-9\s]*$/i,
        isIn: [['USD', 'ZAR', 'EUR', 'BPD', 'YEN', 'WON']],
      },
    },
    tradeRef: {
      type: DataTypes.STRING,
      validate: {
        isUppercase: true,
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    apnNum: {
      type: DataTypes.STRING,
      validate: {
        isUppercase: true,
        is: /^[a-zA-Z0-9\s]*$/i, // dashes needed
      },
    },
    bank: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    apnDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
  },
  { sequelize, modelName: 'Financials', timestamps: true },
);

Financials.sync();

module.exports = Financials;
