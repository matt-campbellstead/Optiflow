'use strict';
const { sequelize } = require('../../../sequelize/db');
const { Model, DataTypes } = require('sequelize');
const AppError = require('../../../utils/AppError');

class Customs extends Model {}

Customs.init(
  {
    agent: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isUppercase: true,
      },
    },
    agentCode: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
      },
    },
    bOeNum: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
      },
    },
    bOeReleaseDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    bOeAssessDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    releaseDepot: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isUppercase: true,
      },
    },
    lrnNum: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    mrnNum: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
  },
  { sequelize, modelName: 'Customs', timestamps: true },
);

Customs.beforeCreate(async (customs, options) => {
  // FK = Foreign Key
  const docWithSameFK = await Customs.findOne({
    where: { customsMasterId: customs.customsMasterId },
  });

  if (docWithSameFK)
    return Promise.reject(
      new AppError(
        "A document with the same value for 'MasterId' already exists.",
        400,
      ),
    );
});

Customs.sync();

module.exports = Customs;
