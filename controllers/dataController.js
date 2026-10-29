'use strict';
const factory = require('./factory');
const User = require('../models/mongoose/mongooseModel');
const Usershipment = require('../models/mongoose/mongooseSubModel');
const Master = require('../models/sequelize/shipmentModels/masterModel');
const Shippers = require('../models/sequelize/shipmentModels/shippersModel');
const Timeline = require('../models/sequelize/shipmentModels/timelineModel');
const Details = require('../models/sequelize/shipmentModels/shipDetailModel');
const Financials = require('../models/sequelize/shipmentModels/financialDetailModel');
const Conveyance = require('../models/sequelize/shipmentModels/conveyanceModel');
const Customs = require('../models/sequelize/shipmentModels/customsModel');
const Customers = require('../models/sequelize/shipmentModels/customerModel');
const Consignees = require('../models/sequelize/shipmentModels/consigneesModel');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');
const FreightApiMaster = require('../models/sequelize/freightApiModels/freightApiMasterModel');
const FreightApiFuelPrices = require('../models/sequelize/freightApiModels/freightApiFuelPricesModel');
const FreightApiPortCongestion = require('../models/sequelize/freightApiModels/freightApiPortCongestionModel');
const FreightApiDisruptions = require('../models/sequelize/freightApiModels/freightApiDisruptionsModel');

exports.timelineCrud = factory.wholeCrud(Timeline, [
  'get',
  'create',
  'delete',
  'update',
]);

exports.shippersCrud = factory.wholeCrud(Shippers);

exports.detailsCrud = factory.wholeCrud(Details);

exports.financialsCrud = factory.wholeCrud(Financials);

exports.customsCrud = factory.wholeCrud(Customs);

exports.conveyanceCrud = factory.wholeCrud(Conveyance);

exports.customersCrud = factory.wholeCrud(Customers);

exports.getCustomers = asyncHandler(async (req, res, next) => {
  const whereObject = {};

  if (req.query.userId) whereObject.userId = req.query.userId;
  if (req.query.id) whereObject.id = req.query.id;
  if (req.query.companyName) whereObject.companyName = req.query.companyName;

  const query = await Customers.findOne({
    where: whereObject,
  });

  res.status(200).json({
    status: 'success',
    data: {
      query,
    },
  });
});

exports.consigneesCrud = factory.wholeCrud(Consignees);

exports.getMasterData = asyncHandler(async (req, res, next) => {
  const whereObject = {};
  const routingWhereObject = {};

  if (req.query.isCurrent)
    whereObject.isCurrent = req.query.isCurrent === 'true';
  else whereObject.isCurrent = true;

  if (req.query.routing) routingWhereObject.routing = req.query.routing;

  const masterQuery = await Master.findAll({
    //where: { isCurrent: true },
    where: whereObject,
    order: [['id', 'DESC']],
    include: [
      { model: Shippers },
      { model: Timeline },
      { model: Details, where: routingWhereObject },
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

exports.freightApiCrud = factory.wholeCrud(FreightApiMaster);
exports.freightApiFuelPricesCrud = factory.wholeCrud(FreightApiFuelPrices);
exports.freightApiPortCongestionCrud = factory.wholeCrud(
  FreightApiPortCongestion,
);

exports.writeApiMasterDoc = asyncHandler(async (req, res, next) => {
  console.log(req.params);

  if (req.params.key !== process.env.MY_FREIGHT_API_KEY)
    return next(new AppError('Not the correct key - access denied.', 401));

  let query;

  try {
    query = await FreightApiMaster.create();
    console.log(query);
    req.masterId = query.dataValues.id;
  } catch (err) {
    throw err;
  }

  next();
});

exports.queryAndWriteFuelPrices = asyncHandler(async (req, res, next) => {
  let result;
  console.log('Req.masterId is: ', req.masterId);

  try {
    const response = await fetch(
      'https://freightpulsehq.com/api/v1/fuel-prices',
      {
        method: 'GET',
        headers: {
          'X-Api-Key': process.env.FREIGHTPULSEHQ_API_KEY,
        },
      },
    );

    if (!response.ok)
      return next(
        new AppError('There was a problem getting the Freight data', 404),
      );

    result = await response.json();
  } catch (err) {
    throw err;
  }

  req.documents = [];

  if (result.data.available && result.data.available === false)
    console.log(
      'There was no available information for this fuel price request',
    );

  if (!result.data.available || result.data.available !== false) {
    const query = await FreightApiFuelPrices.create({
      dataMasterId: req.masterId,
      reqTimeStamp: result.data.timestamp,
      infoSource: result.data.source,
      dieselAvgPrice: result.data.data.diesel.national_average,
      dieselPriceChangePercent: result.data.data.diesel.change_percent,
      dieselUpdatedAt: result.data.data.diesel.updated_at,
      gasolineAvgPrice: result.data.data.gasoline.national_average,
      gasolinePriceChangePercent: result.data.data.gasoline.change_percent,
      gasolineUpdatedAt: result.data.data.gasoline.updated_at,
    });

    req.documents.push(query);
  }

  next();
});

exports.queryAndWritePortCongestion = asyncHandler(async (req, res, next) => {
  let result;
  try {
    const response = await fetch(
      'https://freightpulsehq.com/api/v1/port-congestion?country=ZAF',
      {
        method: 'GET',
        headers: {
          'X-Api-Key': process.env.FREIGHTPULSEHQ_API_KEY,
        },
      },
    );

    if (!response.ok)
      return next(
        new AppError('There was a problem getting the Freight data', 404),
      );

    result = await response.json();
  } catch (err) {
    throw err;
  }

  let singleResult = result.data.results.filter(
    (item) => item.port === 'Cape Town',
  );

  singleResult = singleResult[0];

  if (!singleResult.available) {
    console.log(
      'there was no available information for Cape Town port. DB entry thus not written.',
    );
    return next();
  } else {
    const query = await FreightApiPortCongestion.create({
      dataMasterId: req.masterId,
      port: singleResult.port,
      locode: singleResult.locode,
      country: singleResult.country,
      congestion: singleResult.congestion,
      asOf: singleResult.as_of,
      recentAvgPortcallsPerDay:
        singleResult.metrics.recent_avg_portcalls_perday,
      baselineAvgPortcallsPerDay:
        singleResult.metrics.baseline_avg_portcalls_perday,
      ratioVsBaseline: singleResult.metrics.ratio_vs_baseline,
    });

    req.documents.push(query);
  }

  next();
});

exports.queryAndWriteDisruptions = asyncHandler(async (req, res, next) => {
  let result;
  try {
    const response = await fetch(
      'https://freightpulsehq.com/api/v1/disruptions',
      {
        method: 'GET',
        headers: {
          'X-Api-Key': process.env.FREIGHTPULSEHQ_API_KEY,
        },
      },
    );

    if (!response.ok)
      return next(
        new AppError('There was a problem getting the Freight data', 404),
      );

    result = await response.json();
  } catch (err) {
    throw err;
  }

  const disruptionsOutsideUSA = result.data.results.filter(
    (disruption) =>
      disruption.location !== null &&
      !disruption.affected_countries.every((country) => country === 'USA'),
  );

  console.log(disruptionsOutsideUSA.length);

  const bulkDocuments = [];

  disruptionsOutsideUSA.forEach((disruption) => {
    bulkDocuments.push({
      dataMasterId: req.masterId,
      title: disruption.title,
      type: disruption.type,
      severity: disruption.severity,
      magnitude: disruption.magnitude ? disruption.magnitude : null,
      country: disruption.country,
      locationLatitude: disruption.location.lat,
      locationLongitude: disruption.location.lon,
      source: disruption.source,
      updatedAt: disruption.updated_at,
      url: disruption.url,
    });
  });

  const documents = await FreightApiDisruptions.bulkCreate(bulkDocuments);

  req.documents.push(documents);

  const allDocuments = [...req.documents];

  res.status(200).json({
    status: 'success',
    message: 'data fetched and written to DB succesfully',
    data: {
      data: allDocuments,
    },
  });
});
