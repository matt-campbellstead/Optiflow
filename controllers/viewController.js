'use strict';
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const factory = require('./factory');
const User = require('../models/mongoose/mongooseModel');
const Master = require('../models/sequelize/shipmentModels/masterModel');
const Shippers = require('../models/sequelize/shipmentModels/shippersModel');
const Timeline = require('../models/sequelize/shipmentModels/timelineModel');
const Details = require('../models/sequelize/shipmentModels/shipDetailModel');
const Conveyance = require('../models/sequelize/shipmentModels/conveyanceModel');
const Financials = require('../models/sequelize/shipmentModels/financialDetailModel');
const Customs = require('../models/sequelize/shipmentModels/customsModel');
const Consignees = require('../models/sequelize/shipmentModels/consigneesModel');
const Customers = require('../models/sequelize/shipmentModels/customerModel');
const FreightApiMaster = require('../models/sequelize/freightApiModels/freightApiMasterModel');
const FreightApiFuelPrices = require('../models/sequelize/freightApiModels/freightApiFuelPricesModel');
const FreightApiPortCongestion = require('../models/sequelize/freightApiModels/freightApiPortCongestionModel');
const FreightApiDisruptions = require('../models/sequelize/freightApiModels/freightApiDisruptionsModel');

exports.homePage = asyncHandler(async (req, res, next) => {
  const token = req.csrfToken();

  const { count, rows } = await FreightApiMaster.findAndCountAll();

  const freightApiDocument = await FreightApiMaster.findOne({
    where: { id: count },
    include: [
      { model: FreightApiFuelPrices },
      { model: FreightApiPortCongestion },
      { model: FreightApiDisruptions },
    ],
  });

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://api.mapbox.com https://events.mapbox.com ;default-src 'self' https://api.mapbox.com ; base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';object-src 'none';script-src https://api.mapbox.com 'self' blob: ; img-src 'self' https://api.mapbox.com  data:; script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
    )
    .render('home', {
      title: 'Home page',
      csrfToken: token,
      data: freightApiDocument,
    });
});

exports.logInUser = factory.renderPageWithToken(
  'login',
  'Log in to your account',
);

exports.displayShipment = asyncHandler(async (req, res, next) => {
  const token = req.csrfToken();
  const userId = `${req.user._id}`; //JSON.stringify(req.user._id);

  const shipments = await Master.findAll({
    where: { users: userId },
    include: [
      { model: Timeline },
      { model: Details },
      { model: Shippers },
      { model: Financials },
    ],
  });
  if (!shipments) {
    return next(
      new AppError('There is no data matching that description.', 404),
    );
  }

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

exports.submitData = asyncHandler(async (req, res, next) => {
  const token = req.csrfToken();

  const customers = await User.find({
    $and: [
      { name: { $ne: process.env.ADMIN_1 } },
      { name: { $ne: process.env.ADMIN_2 } },
    ],
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

exports.myAccount = factory.renderPageWithToken(
  'myAccount',
  'My Account Settings',
);

exports.updateShipment = factory.renderPageWithToken(
  'adminUpdate',
  'Update data',
);

exports.activateAccount = factory.renderPageWithToken(
  'activation',
  'Account activation',
);

exports.resetPasswordInit = factory.renderPageWithToken(
  'resetPasswordInit',
  'Reset your password',
);

exports.resetPasswordAction = factory.renderPageWithToken(
  'resetPasswordAction',
  'Reset your password',
);

exports.signUp = factory.renderPageWithToken('signup', 'Create an account');

exports.myFiles = asyncHandler(async (req, res, next) => {
  const token = req.csrfToken();

  const userId = req.user.id;

  const document = await Customers.findOne({ where: { userId } });

  //if (!document) return next(new AppError('No customer document found!', 404));

  const data = document ? document.downloadLink : null;

  res.status(200).render('myFiles', {
    title: 'My file portal',
    csrfToken: token,
    data,
  });
});
