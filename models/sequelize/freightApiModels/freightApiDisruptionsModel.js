const { sequelize } = require('../../../sequelize/db');
const { Model, DataTypes } = require('sequelize');

class FreightApiDisruptions extends Model {}

FreightApiDisruptions.init(
  {
    title: DataTypes.STRING,

    type: DataTypes.STRING,

    severity: DataTypes.STRING,

    magnitude: DataTypes.FLOAT,

    country: DataTypes.STRING,

    locationLatitude: DataTypes.FLOAT,

    locationLongitude: DataTypes.FLOAT,

    updatedAt: DataTypes.DATE,

    source: DataTypes.STRING,

    url: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'FreightApiDisruptions',
    timestamps: false,
  },
);

FreightApiDisruptions.sync();

module.exports = FreightApiDisruptions;
