'use strict';
const { sequelize } = require('../sequelize/db');
const { Model, DataTypes } = require('sequelize');
const Shippers = require('./shippersModel');
const Timeline = require('./timelineModel');
const Details = require('./shipDetailModel');
const Financials = require('./financialDetailModel');
const Customs = require('./customsModel');
const Conveyance = require('./conveyanceModel');

class Master extends Model {}

Master.init(
  {
    shipment_file_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-zA-Z0-9\s]*$/i,
      },
    },
    users: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Master',
    timestamps: true,
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  },
);
Master.hasOne(Shippers); //{ foreignKey: { name: 'master_id', allowNull: false },}
Shippers.belongsTo(Master);

Master.hasOne(Timeline);
Timeline.belongsTo(Master);

Master.hasOne(Details);
Details.belongsTo(Master);

Master.hasOne(Financials);
Financials.belongsTo(Master);

Master.hasOne(Conveyance);
Conveyance.belongsTo(Master);

Master.hasOne(Customs);
Customs.belongsTo(Master);

Master.sync();

module.exports = Master;
