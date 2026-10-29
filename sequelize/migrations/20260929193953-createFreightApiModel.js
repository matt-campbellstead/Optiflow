'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('FreightApiMaster', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('FreightApiMaster');
  },
};
