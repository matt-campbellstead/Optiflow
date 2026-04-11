'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('Consignees', {
      consigneesMasterId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Masters',
          },
          key: 'id',
        },
        allowNull: false,
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
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
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('Consignees');
  },
};
