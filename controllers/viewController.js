'use strict';
const asyncHandler = require('../utils/asyncHandler');
const Master = require('../models/masterModel');
const Shippers = require('../models/shippersModel');
const Timeline = require('../models/timelineModel');
const Details = require('../models/shipDetailModel');
//const Usershipment = require('../models/mongooseSubModel');
const User = require('../models/mongooseModel');
const AppError = require('../utils/AppError');
const Conveyance = require('../models/conveyanceModel');
const Financials = require('../models/financialDetailModel');
const Customs = require('../models/customsModel');
const Consignees = require('../models/consigneesModel');
const Customers = require('../models/customerModel');

exports.homePage = (req, res) => {
  res.status(200).render('home', {
    title: 'Home page',
  });
};

exports.logInUser = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://cdn.jsdelivr.net ; base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdn.jsdelivr.net 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
    )
    .render('login', {
      title: 'Log in to your account',
    });
};

exports.displayShipment = asyncHandler(async (req, res, next) => {
  const userId = `${req.user._id}`; //JSON.stringify(req.user._id);
  //console.log(userId);
  const shipments = await Master.findAll({
    where: { users: userId },
    include: [{ model: Timeline }, { model: Details }],
  });
  if (!shipments) {
    return next(
      new AppError('There is no data matching that description.', 404),
    );
  }
  //console.log(shipment);
  res.status(200).render('dashboard', {
    title: 'Your dashboard',
    shipments,
  });
});

exports.displayAllShipments = asyncHandler(async (req, res, next) => {
  const allShipments = await Master.findAll({
    where: { isCurrent: true },
    order: [['id', 'DESC']],
    include: [
      { model: Shippers },
      { model: Timeline },
      {
        model: Details,
      },
      { model: Financials },
      { model: Customs },
      { model: Conveyance },
      { model: Customers },
      { model: Consignees },
    ],
  });

  if (!allShipments) {
    return next(new AppError('There is no data matching that request.', 404));
  }

  res.status(200).render('dashboard', {
    title: 'Your Ops Dashboard',
    allShipments,
  });
});

exports.opsFunctions = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find();

  if (!allUsers) {
    return next(new AppError('There are no users matching that request!', 404));
  }

  res.status(200).render('adminFunctions', {
    title: 'Admin Functions',
    allUsers,
  });
});

exports.submitData = (req, res) => {
  res.status(200).render('adminSubmit', {
    title: 'Admin Data Submission',
  });
};

exports.opsOldShipments = asyncHandler(async (req, res, next) => {
  const oldShipments = await Master.findAll({
    where: { isCurrent: false },
    include: [
      { model: Shippers },
      { model: Timeline },
      {
        model: Details,
      },
      { model: Financials },
      { model: Customs },
      { model: Conveyance },
      { model: Customers },
      { model: Consignees },
    ],
  });

  res.status(200).render('adminOld', {
    title: 'Past Shipments',
    oldShipments,
  });
});

const routing = (type) =>
  asyncHandler(async (req, res, next) => {
    const document = await Master.findAll({
      where: { isCurrent: true },
      include: [
        { model: Shippers },
        { model: Timeline },
        {
          model: Details,
          where: {
            routing: `${type}`,
          },
        },
        { model: Financials },
        { model: Customs },
        { model: Conveyance },
        { model: Customers },
        { model: Consignees },
      ],
    });

    res.status(200).render(`admin${type}`, {
      title: `${type} Shipments`,
      document,
    });
  });

exports.opsExports = routing('Export');
exports.opsImports = routing('Import');

exports.updateShipment = (req, res) => {
  res.status(200).render('adminUpdate', {
    title: 'Update data',
  });
};
