'use strict';
const Shipment = require('../sequelize/model');
const User = require('../mongooseModel');
const Usershipment = require('../mongooseSubModel');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.getData = asyncHandler(async (req, res, next) => {
  const shipData = await Shipment.findAll({ order: [['id', 'DESC']] });

  res.status(200).json({
    status: 'success',
    results: shipData.length,
    data: {
      shipData,
    },
  });
});

exports.getSingleData = asyncHandler(async (req, res, next) => {
  const shipment = await Shipment.findOne({ where: { id: req.params.id } });

  if (shipment === null)
    return next(
      new AppError('This data is not available or does not exist!', 404),
    );

  res.status(200).json({
    status: 'success',
    data: {
      shipment,
    },
  });
});

exports.createData = asyncHandler(async (req, res, next) => {
  const newShip = await Shipment.create({
    optimum_customer_name: req.body.optimum_customer_name,
    routing: req.body.routing,
    mode: req.body.mode,
    shipper: req.body.shipper,
    no_packages: req.body.no_packages,
    gross_weight: req.body.gross_weight,
    volumetric_weight: req.body.volumetric_weight,
    users: req.body.users,
    fileNo: req.body.fileNo,
    isCurrent: req.body.isCurrent,
    incoterm: req.body.incoterm,
  });

  const newId = newShip.id;

  //  await User.findByIdAndUpdate(
  //     req.body.users,
  //     { shipments: newId },
  //     {
  //       new: true,
  //       runValidators: true,
  //     },
  //   );
  const newDoc = await Usershipment.create({
    shipment: newId,
    client: req.body.users,
  });

  await User.findByIdAndUpdate(req.body.users, { shipments: newDoc._id });

  console.log(newShip);
  res.status(201).json({
    status: 'success',
    message: 'entry added successfully',
    data: {
      newShip,
      newDoc,
    },
  });
});

exports.deleteAllData = asyncHandler(async (req, res, next) => {
  await Shipment.destroy({
    truncate: true,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateData = asyncHandler(async (req, res, next) => {
  await Shipment.update(req.body, {
    where: { id: req.params.id },
  });

  res.status(201).json({
    status: 'success',
  });
});
