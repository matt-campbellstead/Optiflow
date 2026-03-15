'use strict';

const { DataTypes } = require('sequelize');
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('shipments', 'users', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('shipments', 'users');
  },
};
