'use strict';
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getData = (Model) =>
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

const createData = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'entry added successfully',
      data: {
        document,
      },
    });
  });

const deleteData = (Model) =>
  asyncHandler(async (req, res, next) => {
    await Model.destroy({
      truncate: true,
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const updateData = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findOne({ where: { id: req.params.id } });
    await document.update(req.body);
    await document.save();

    if (document[0] === 0) {
      return next(new AppError('No document with that ID found.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { document },
    });
  });

const getSingle = (Model) =>
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

const renderPageWithToken = (template, title) => (req, res) => {
  const token = req.csrfToken();

  res.status(200).render(template, {
    title: title,
    csrfToken: token,
  });
};

const filterCrud = (array1, array2) => {
  const crudOptions = [...array1];

  const newArr = array2.filter((string) => {
    return crudOptions.some((el) => el === string);
  });
  return newArr;
};

const wholeCrud = (Model, options) => {
  const modelString = String(Model).split(' ')[1];
  let crudArray = ['get', 'create', 'delete', 'update', 'getSingle'];

  const crudObject = {};

  if (options) crudArray = filterCrud(options, crudArray);

  crudArray.forEach((type) => {
    const dynamicKey = `${type}${modelString}`;

    if (type === 'get') crudObject[dynamicKey] = getData(Model);

    if (type === 'create') crudObject[dynamicKey] = createData(Model);

    if (type === 'update') crudObject[dynamicKey] = updateData(Model);

    if (type === 'delete') crudObject[dynamicKey] = deleteData(Model);

    if (type === 'getSingle') crudObject[dynamicKey] = getSingle(Model);
  });

  return crudObject;
};

module.exports = {
  getData,
  createData,
  deleteData,
  updateData,
  getSingle,
  renderPageWithToken,
  wholeCrud,
};
