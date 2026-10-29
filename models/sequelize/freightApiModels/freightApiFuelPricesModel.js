const { sequelize } = require('../../../sequelize/db');
const { Model, DataTypes } = require('sequelize');

class FreightApiFuelPrices extends Model {}

FreightApiFuelPrices.init(
  {
    reqTimeStamp: DataTypes.DATE,

    infoSource: DataTypes.STRING,

    dieselAvgPrice: DataTypes.FLOAT,

    dieselPriceChangePercent: DataTypes.FLOAT,

    dieselUpdatedAt: DataTypes.DATEONLY,

    gasolineAvgPrice: DataTypes.FLOAT,

    gasolinePriceChangePercent: DataTypes.FLOAT,

    gasolineUpdatedAt: DataTypes.DATEONLY,
  },
  {
    sequelize,
    modelName: 'FreightApiFuelPrices',
    timestamps: false,
  },
);

FreightApiFuelPrices.sync();

module.exports = FreightApiFuelPrices;
