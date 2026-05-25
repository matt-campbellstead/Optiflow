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
const Customers = require('../models/customerModel');
const Consignees = require('../models/consigneesModel');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const filterCrud = (array1, array2) => {
  const crudOptions = [...array1];

  const newArr = array2.filter((string) => {
    return crudOptions.some((el) => el === string);
  });
  return newArr;
};

const wholeCrud = (Model, options) => {
  const modelString = String(Model).split(' ')[1];
  let crudArray = ['get', 'create', 'delete', 'update', 'getSingle'];

  const crudObject = {};

  if (options) {
    crudArray = filterCrud(options, crudArray);
  }

  crudArray.forEach((type) => {
    const dynamicKey = `${type}${modelString}`;

    if (type === 'get') {
      crudObject[dynamicKey] = factory.getData(Model);
    }
    if (type === 'create') {
      crudObject[dynamicKey] = factory.createData(Model);
    }
    if (type === 'update') {
      crudObject[dynamicKey] = factory.updateData(Model);
    }
    if (type === 'delete') {
      crudObject[dynamicKey] = factory.deleteData(Model);
    }
    if (type === 'getSingle') {
      crudObject[dynamicKey] = factory.getSingle(Model);
    }
  });

  return crudObject;
};

exports.timelineCrud = wholeCrud(Timeline, [
  'get',
  'create',
  'delete',
  'update',
]);

exports.shippersCrud = wholeCrud(Shippers, [
  'get',
  'create',
  'delete',
  'update',
]);

exports.detailsCrud = wholeCrud(Details);

exports.financialsCrud = wholeCrud(Financials);

exports.customsCrud = wholeCrud(Customs, ['get', 'create', 'delete', 'update']);

exports.conveyanceCrud = wholeCrud(Conveyance, [
  'get',
  'create',
  'delete',
  'update',
]);

exports.customersCrud = wholeCrud(Customers);

exports.consigneesCrud = wholeCrud(Consignees);

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
      { model: Customers },
      { model: Consignees },
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
    CustomerId: req.body.CustomerId,
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
