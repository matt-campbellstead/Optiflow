'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('FreightApiPortCongestions', {
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

      port: DataTypes.STRING,

      locode: DataTypes.STRING,

      country: DataTypes.STRING,

      congestion: DataTypes.STRING,

      asOf: DataTypes.DATEONLY,

      recentAvgPortcallsPerDay: DataTypes.FLOAT,

      baselineAvgPortcallsPerDay: DataTypes.FLOAT,

      ratioVsBaseline: DataTypes.FLOAT,
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('FreightApiPortCongestion');
  },
};
