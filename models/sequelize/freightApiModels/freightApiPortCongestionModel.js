const { sequelize } = require('../../../sequelize/db');
const { Model, DataTypes } = require('sequelize');

class FreightApiPortCongestion extends Model {}

FreightApiPortCongestion.init(
  {
    port: DataTypes.STRING,

    locode: DataTypes.STRING,

    country: DataTypes.STRING,

    congestion: DataTypes.STRING,

    asOf: DataTypes.DATEONLY,

    recentAvgPortcallsPerDay: DataTypes.FLOAT,

    baselineAvgPortcallsPerDay: DataTypes.FLOAT,

    ratioVsBaseline: DataTypes.FLOAT,
  },
  {
    sequelize,
    modelName: 'FreightApiPortCongestions',
    timestamps: false,
  },
);

FreightApiPortCongestion.sync();

module.exports = FreightApiPortCongestion;
