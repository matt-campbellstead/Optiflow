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
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://api.mapbox.com https://events.mapbox.com ;default-src 'self' https://api.mapbox.com ; base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';object-src 'none';script-src https://api.mapbox.com 'self' blob: ; img-src 'self' https://api.mapbox.com  data:; script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
    )
    .render('home', {
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

  const data = await Customers.findAll({
    order: [['id', 'DESC']],
  });

  const masterQuery = await Master.findAll({ where: { isCurrent: true } });

  res.status(200).render('adminSubmit', {
    title: 'Admin Data Submission',
    csrfToken: token,
    masterQuery,
    customers,
    data,
  });
});

//TODO: make view controller factory function
exports.updateShipment = (req, res) => {
  const token = req.csrfToken();
  /*
  const queryObject = {};
  if (req.query.id) queryObject.id = req.query.id;

  let query;

  switch (req.query.table) {
    case 'Customer':
      query = await Customers.findOne({ where: queryObject });
      break;
    case 'Shipment-Details':
      query = await Details.findOne({ where: queryObject });
      break;
    case 'Shipper':
      query = await Shippers.findOne({ where: queryObject });
      break;
    case 'Consignee':
      query = Consignees.findOne({ where: queryObject });
      break;
    case 'Financial':
      query = await Financials.findOne({ where: queryObject });
      break;
    case 'Conveyance':
      query = await Conveyance.findOne({ where: queryObject });
      break;
    case 'Customs':
      query = await Customs.findOne({ where: queryObject });
      break;
  }

  console.log(query);
  */

  //console.log(req.params);

  res.status(200).render('adminUpdate', {
    title: 'Update data',
    csrfToken: token,
  });
};

exports.activateAccount = (req, res) => {
  const token = req.csrfToken();
  res.status(200).render('activation', {
    title: 'Account activation',
    csrfToken: token,
  });
};

exports.resetPasswordInit = (req, res) => {
  const token = req.csrfToken();
  res.status(200).render('resetPasswordInit', {
    title: 'Reset your password',
    csrfToken: token,
  });
};

exports.resetPasswordAction = (req, res) => {
  const token = req.csrfToken();
  res.status(200).render('resetPasswordAction', {
    title: 'Reset your password',
    csrfToken: token,
  });
};

exports.signUp = (req, res) => {
  const token = req.csrfToken();
  res.status(200).render('signup', {
    title: 'Create an account',
    csrfToken: token,
  });
};
