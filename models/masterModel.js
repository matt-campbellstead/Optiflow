'use strict';
const { sequelize } = require('../sequelize/db');
const { Model, DataTypes } = require('sequelize');
const Shippers = require('./shippersModel');
const Timeline = require('./timelineModel');
const Details = require('./shipDetailModel');
const Financials = require('./financialDetailModel');
const Customs = require('./customsModel');
const Conveyance = require('./conveyanceModel');
const Customers = require('./customerModel');
const Consignees = require('./consigneesModel');

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
////////////////////////
Master.hasOne(Shippers, {
  foreignKey: { name: 'shippersMasterId', allowNull: false },
});
Shippers.belongsTo(Master, {
  foreignKey: { name: 'shippersMasterId', allowNull: false },
});
////////////////////////
////////////////////////
Master.hasOne(Timeline, {
  foreignKey: { name: 'timelineMasterId', allowNull: false },
});
Timeline.belongsTo(Master, {
  foreignKey: { name: 'timelineMasterId', allowNull: false },
});
////////////////////////
////////////////////////
Master.hasOne(Details, {
  foreignKey: { name: 'detailsMasterId', allowNull: false },
});
Details.belongsTo(Master, {
  foreignKey: { name: 'detailsMasterId', allowNull: false },
});
////////////////////////
////////////////////////
Master.hasOne(Financials, {
  foreignKey: { name: 'financialsMasterId', allowNull: false },
});
Financials.belongsTo(Master, {
  foreignKey: { name: 'financialsMasterId', allowNull: false },
});
////////////////////////
////////////////////////
Master.hasOne(Conveyance, {
  foreignKey: { name: 'conveyanceMasterId', allowNull: false },
});
Conveyance.belongsTo(Master, {
  foreignKey: { name: 'conveyanceMasterId', allowNull: false },
});
////////////////////////
////////////////////////
Master.hasOne(Customs, {
  foreignKey: { name: 'customsMasterId', allowNull: false },
});
Customs.belongsTo(Master, {
  foreignKey: { name: 'customsMasterId', allowNull: false },
});
////////////////////////
////////////////////////
Customers.hasMany(Master, {
  foreignKey: { name: 'CustomerId', allowNull: false },
});
Master.belongsTo(Customers, {
  foreignKey: { name: 'CustomerId', allowNull: false },
});
////////////////////////
////////////////////////
Master.hasOne(Consignees, {
  foreignKey: { name: 'consigneesMasterId', allowNull: false },
});
Consignees.belongsTo(Master, {
  foreignKey: { name: 'consigneesMasterId', allowNull: false },
});

Master.sync();

module.exports = Master;
