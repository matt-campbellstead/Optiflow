'use strict';
const { sequelize } = require('../../../sequelize/db');
const { Model, DataTypes } = require('sequelize');
const AppError = require('../../../utils/AppError');

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

Shippers.beforeCreate(async (shippers, options) => {
  // FK = Foreign Key
  const docWithSameFK = await Shippers.findOne({
    where: { shippersMasterId: shippers.shippersMasterId },
  });

  if (docWithSameFK)
    return Promise.reject(
      new AppError(
        "A document with the same value for 'MasterId' already exists.",
        400,
      ),
    );
});

Shippers.sync();

module.exports = Shippers;
