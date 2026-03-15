'use strict';
const { sequelize } = require('./db');
const { Model, DataTypes } = require('sequelize');

class Shipment extends Model {}

Shipment.init(
  {
    optimum_customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i, //^[a-zA-Z\s]+$/i,
      },
    },
    routing: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUppercase: true,
      },
    },
    shipper: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    no_packages: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        isInt: true,
      },
    },
    gross_weight: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        contains: 'kg',
      },
    },
    volumetric_weight: {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        contains: 'CBM',
      },
    },
    users: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      //allowNull: false,
    },
    fileNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    incoterm: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [['EXW', 'FOB', 'CFR', 'CIF']],
      },
    },
  },
  {
    sequelize,
    modelName: 'Shipment',
    timestamps: true,
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  },
);

Shipment.sync();

module.exports = Shipment;
