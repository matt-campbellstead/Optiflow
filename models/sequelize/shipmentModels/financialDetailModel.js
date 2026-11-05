'use strict';
const { sequelize } = require('../../../sequelize/db');
const { Model, DataTypes } = require('sequelize');
const AppError = require('../../../utils/AppError');

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

Financials.beforeCreate(async (financials, options) => {
  // FK = Foreign Key
  const docWithSameFK = await Financials.findOne({
    where: { financialsMasterId: financials.financialsMasterId },
  });

  if (docWithSameFK)
    return Promise.reject(
      new AppError(
        "A document with the same value for 'MasterId' already exists.",
        400,
      ),
    );
});

Financials.sync();

module.exports = Financials;
