'use strict';
const factory = require('./factory');
const Master = require('../models/masterModel');
const User = require('../models/mongooseModel');
const Usershipment = require('../models/mongooseSubModel');
const Shippers = require('../models/shippersModel');
const Timeline = require('../models/timelineModel');
const Details = require('../models/shipDetailModel');
const Financials = require('../models/financialDetailModel');
const Conveyance = require('../models/conveyanceModel');
const Customs = require('../models/customsModel');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.getTimeline = factory.getData(Timeline);
exports.createTimeline = factory.createData(Timeline);
exports.deleteTimeline = factory.deleteData(Timeline);
exports.updateTimeline = factory.updateData(Timeline);

exports.getShippers = factory.getData(Shippers);
exports.createShippers = factory.createData(Shippers);
exports.deleteShippers = factory.deleteData(Shippers);
exports.updateShippers = factory.updateData(Shippers);

exports.getDetails = factory.getData(Details);
exports.createDetails = factory.createData(Details);
exports.deleteDetails = factory.deleteData(Details);
exports.updateDetails = factory.updateData(Details);

exports.getFinancials = factory.getData(Financials);
exports.createFinancials = factory.createData(Financials);
exports.deleteFinancials = factory.deleteData(Financials);
exports.updateFinancials = factory.updateData(Financials);

exports.getCustoms = factory.getData(Customs);
exports.createCustoms = factory.createData(Customs);
exports.deleteCustoms = factory.deleteData(Customs);
exports.updateCustoms = factory.updateData(Customs);

exports.getConveyance = factory.getData(Conveyance);
exports.createConveyance = factory.createData(Conveyance);
exports.deleteConveyance = factory.deleteData(Conveyance);
exports.updateConveyance = factory.updateData(Conveyance);

exports.getMasterData = asyncHandler(async (req, res, next) => {
  const masterQuery = await Master.findAll({
    where: { isCurrent: true },
    order: [['id', 'DESC']],
    include: [
      { model: Shippers },
      { model: Timeline },
      { model: Details },
      { model: Financials },
      { model: Customs },
      { model: Conveyance },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: masterQuery.length,
    data: {
      masterQuery,
    },
  });
});

exports.getSingleData = asyncHandler(async (req, res, next) => {
  const masterQuery = await Master.findOne({ where: { id: req.params.id } });

  if (masterQuery === null)
    return next(
      new AppError('This data is not available or does not exist!', 404),
    );

  res.status(200).json({
    status: 'success',
    data: {
      masterQuery,
    },
  });
});

exports.createMasterData = asyncHandler(async (req, res, next) => {
  const masterPost = await Master.create({
    shipment_file_id: req.body.shipment_file_id,
    users: req.body.users,
    isCurrent: req.body.isCurrent,
  });

  const newId = masterPost.id;

  const newDoc = await Usershipment.create({
    shipment: newId,
    client: req.body.users,
  });

  await User.findByIdAndUpdate(req.body.users, { shipments: newDoc._id });

  res.status(201).json({
    status: 'success',
    message: 'entry added successfully',
    data: {
      masterPost,
      newDoc,
    },
  });
});

exports.deleteMasterData = factory.deleteData(Master);
exports.updateMasterData = factory.updateData(Master);
