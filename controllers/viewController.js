const asyncHandler = require('../utils/asyncHandler');
const Shipment = require('../sequelize/model');
const Usershipment = require('../mongooseSubModel');
const User = require('../mongooseModel');
const AppError = require('../utils/AppError');

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
  const shipments = await Shipment.findAll({
    where: { users: userId },
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
  const allShipments = await Shipment.findAll();

  if (!allShipments) {
    return next(new AppError('There is no data matching that request.', 404));
  }

  res.status(200).render('dashboard', {
    title: 'Your Ops Dashboard',
    allShipments,
  });
});

exports.displayUsers = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find();

  if (!allUsers) {
    return next(new AppError('There are no users matching that request!', 404));
  }

  res.status(200).render('adminFunctions', {
    title: 'Admin Functions',
    allUsers,
  });
});

exports.submitShipment = asyncHandler(async (req, res, next) => {
  const newShipment = await Shipment.create({});
});
