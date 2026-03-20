'use strict';
const { sequelize } = require('../sequelize/db');
const { Model, DataTypes } = require('sequelize');

class Details extends Model {}

Details.init(
  {
    incoterms: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [['EXW', 'FOB', 'CFR', 'CIF']],
      },
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUppercase: true, // add regex validate that includes forward slash
      },
    },
    routing: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isIn: [['Import', 'Export']],
      },
    },
    goodsDescriptions: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    packagingType: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i, // add regex validate that includes comma
      },
    },
    containerSpecs: DataTypes.STRING,
    containerQty: DataTypes.INTEGER,

    numItems: {
      type: DataTypes.INTEGER,
      // validate: {
      //   isNumeric: true,
      // },
    },

    grossWeightKg: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i, // add regex validate that includes comma or full stop
        contains: 'kg',
      }, // add regex validate that includes comma or full stop
    },
    netWeightKg: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i, // add regex validate that includes comma or full stop
        contains: 'kg',
      },
    },
    cbm: DataTypes.STRING, // ??

    handlingRequirements: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i, // add regex validate that includes comma or full stop
      },
    },
    dangerousGoods: DataTypes.BOOLEAN,
    codeDrg: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'Details',
    timestamps: true,
  },
);

Details.sync();

module.exports = Details;
