'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('FreightApiDisruptions', {
      dataMasterId: {
        type: DataTypes.INTEGER,

        references: {
          model: {
            tableName: 'FreightApiMasters',
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

      title: DataTypes.STRING,

      type: DataTypes.STRING,

      severity: DataTypes.STRING,

      magnitude: DataTypes.FLOAT,

      country: DataTypes.STRING,

      locationLatitude: DataTypes.FLOAT,

      locationLongitude: DataTypes.FLOAT,

      updatedAt: DataTypes.DATE,

      source: DataTypes.STRING,

      url: DataTypes.STRING,
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('FreightApiDisruptions');
  },
};
