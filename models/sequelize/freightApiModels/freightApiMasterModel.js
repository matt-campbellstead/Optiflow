const { sequelize } = require('../../../sequelize/db');
const { Model, DataTypes } = require('sequelize');
const FreightApiFuelPrices = require('./freightApiFuelPricesModel');
const FreightApiPortCongestion = require('./freightApiPortCongestionModel');
const FreightApiDisruptions = require('./freightApiDisruptionsModel');

class FreightApiMaster extends Model {}

FreightApiMaster.init(
  {
    createdAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'FreightApiMaster',
    timestamps: true,
  },
);

const foreignKeyObject = {
  foreignKey: { name: 'dataMasterId', allowNull: false },
};
///////////
FreightApiMaster.hasOne(FreightApiFuelPrices, foreignKeyObject);
FreightApiFuelPrices.belongsTo(FreightApiMaster, foreignKeyObject);
///////////
FreightApiMaster.hasOne(FreightApiPortCongestion, foreignKeyObject);
FreightApiPortCongestion.belongsTo(FreightApiMaster, foreignKeyObject);
///////////
FreightApiMaster.hasMany(FreightApiDisruptions, foreignKeyObject);
FreightApiDisruptions.belongsTo(FreightApiMaster, foreignKeyObject);
///////////

FreightApiMaster.sync();

module.exports = FreightApiMaster;
