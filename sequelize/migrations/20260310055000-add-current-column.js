'use strict';

const { DataTypes } = require('sequelize');
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('shipments', 'isCurrent', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('shipments', 'isCurrent');
  },
};
