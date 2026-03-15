'use strict';
const asyncHandler = require('../utils/asyncHandler');
const Usershipment = require('../mongooseSubModel');

// exports.setDocIds = (req, res, next) => {
//   if (!req.body.user) req.body.user = req.user.id;

//   next();
// };

exports.getUserShipments = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.params.userid) filter = { client: [{ _id: req.params.userid }] };

  const docs = await Usershipment.find(filter);

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      data: docs,
    },
  });
});
