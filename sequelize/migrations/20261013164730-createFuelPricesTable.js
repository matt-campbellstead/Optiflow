'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('FreightApiFuelPrices', {
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

      reqTimeStamp: DataTypes.DATE,

      infoSource: DataTypes.STRING,

      dieselAvgPrice: DataTypes.FLOAT,

      dieselPriceChangePercent: DataTypes.FLOAT,

      dieselUpdatedAt: DataTypes.DATEONLY,

      gasolineAvgPrice: DataTypes.FLOAT,

      gasolinePriceChangePercent: DataTypes.FLOAT,

      gasolineUpdatedAt: DataTypes.DATEONLY,
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('FreightApiFuelPrices');
  },
};
