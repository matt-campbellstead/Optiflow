'use strict';
const asyncHandler = require('../utils/asyncHandler');
const Master = require('../models/masterModel');
const Shippers = require('../models/shippersModel');
const Timeline = require('../models/timelineModel');
const Details = require('../models/shipDetailModel');
const User = require('../models/mongooseModel');
const AppError = require('../utils/AppError');
const Conveyance = require('../models/conveyanceModel');
const Financials = require('../models/financialDetailModel');
const Customs = require('../models/customsModel');
const Consignees = require('../models/consigneesModel');
const Customers = require('../models/customerModel');

exports.homePage = (req, res) => {
  const token = req.csrfToken();

  res.status(200).set('x-csrf-token', token).render('home', {
    title: 'Home page',
    csrfToken: token,
  });
};

exports.logInUser = (req, res) => {
  const token = req.csrfToken();
  res
    .status(200)
    // .set(
    //   //   'Content-Security-Policy',
    //   //   "default-src 'self' https://cdn.jsdelivr.net ; base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdn.jsdelivr.net 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
    //   //
    //   'x-csrf-token',
    //   token,
    // )
    .render('login', {
      title: 'Log in to your account',
      csrfToken: token,
    });
};

exports.displayShipment = asyncHandler(async (req, res, next) => {
  const token = req.csrfToken();
  const userId = `${req.user._id}`; //JSON.stringify(req.user._id);

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
    csrfToken: token,
  });
});

exports.displayAllShipments = asyncHandler(async (req, res, next) => {
  const token = req.csrfToken();
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
    csrfToken: token,
  });
});

exports.opsFunctions = asyncHandler(async (req, res, next) => {
  const token = req.csrfToken();
  const allUsers = await User.find();

  if (!allUsers) {
    return next(new AppError('There are no users matching that request!', 404));
  }

  res.status(200).render('adminFunctions', {
    title: 'Admin Functions',
    allUsers,
    csrfToken: token,
  });
});

exports.submitData = asyncHandler(async (req, res, next) => {
  const token = req.csrfToken();

  const customers = await User.find({
    $and: [{ name: { $ne: 'Barry' } }, { name: { $ne: 'Matt' } }],
  });

  res.status(200).render('adminSubmit', {
    title: 'Admin Data Submission',
    csrfToken: token,
    customers,
  });
});

exports.opsOldShipments = asyncHandler(async (req, res, next) => {
  const token = req.csrfToken;
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
    csrfToken: token,
  });
});

const routing = (type) =>
  asyncHandler(async (req, res, next) => {
    const token = req.csrfToken();
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
      csrfToken: token,
    });
  });

exports.opsExports = routing('Export');
exports.opsImports = routing('Import');

exports.updateShipment = (req, res) => {
  const token = req.csrfToken();
  res.status(200).render('adminUpdate', {
    title: 'Update data',
    csrfToken: token,
  });
};
