'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('Masters', 'routing', {
      type: DataTypes.STRING,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
        isIn: [['Import', 'Export']],
      },
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('Masters', 'routing');
  },
};
