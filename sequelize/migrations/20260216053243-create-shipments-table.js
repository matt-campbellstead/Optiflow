'use strict';
const { DataTypes } = require('sequelize');
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('shipments', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

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
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('shipments');
  },
};
