'use strict';
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getData = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findAll();
    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        document,
      },
    });
  });

exports.createData = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(
      req.body,
      //object?
    );

    res.status(201).json({
      status: 'success',
      message: 'entry added successfully',
      data: {
        document,
      },
    });
  });

exports.deleteData = (Model) =>
  asyncHandler(async (req, res, next) => {
    await Model.destroy({
      truncate: true,
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateData = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.update(req.body, {
      where: { id: req.params.id },
    });

    if (document === null) {
      return next(new AppError('No document with that ID found.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { document },
    });
  });

exports.getSingle = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findOne({
      where: { id: req.params.id },
    });

    if (document === null) {
      return next(new AppError('No document with that ID found.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { document },
    });
  });
