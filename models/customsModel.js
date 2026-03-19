'use strict';
const { sequelize } = require('../sequelize/db');
const { Model, DataTypes } = require('sequelize');

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

Customs.sync();

module.exports = Customs;
