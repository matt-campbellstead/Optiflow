'use strict';
const { sequelize } = require('../../../sequelize/db');
const { Model, DataTypes } = require('sequelize');
const AppError = require('../../../utils/AppError');

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

Consignees.beforeCreate(async (consignee, options) => {
  // FK = Foreign Key
  const docWithSameFK = await Consignees.findOne({
    where: { consigneesMasterId: consignee.consigneesMasterId },
  });

  if (docWithSameFK)
    return Promise.reject(
      new AppError(
        "A document with the same value for 'MasterId' already exists.",
        400,
      ),
    );
});

Consignees.sync();

module.exports = Consignees;
