'use strict';

const { DataTypes } = require('sequelize');
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('shipments', 'fileNo', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('shipments', 'fileNo');
  },
};
