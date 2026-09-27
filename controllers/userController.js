'use strict';
const User = require('../models/mongooseModel');
const asyncHandler = require('../utils/asyncHandler');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const queryObject = {};
  let user;

  if (req.query.name) {
    queryObject.name = req.query.name;
    user = await User.findOne(queryObject).exec();
  } else user = await User.find();

  res.status(200).json({
    status: 'success',
    results: user.length,
    data: {
      user,
    },
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

exports.getUserByQueryString = asyncHandler(async (req, res, next) => {
  const queryObject = {};
  if (req.query.name) queryObject.name = req.query.name;

  const user = await User.findOne(queryObject);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
