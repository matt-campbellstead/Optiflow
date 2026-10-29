'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('Customers', 'downloadLink', {
      type: DataTypes.STRING,
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('Customers', 'downloadLink');
  },
};
