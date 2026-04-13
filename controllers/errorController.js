'use strict';
const AppError = require('../utils/AppError');
const mylog = require('../log');

const handleCastErrDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value} `;
  return new AppError(message, 400);
};

const handleDuplicateErrDB = (err) => {
  const value = err.errorResponse.errmsg.match(/{(.*?)}/)[1];

  const message = `Duplicate field value: ${value}. Please use another field value.`;
  return new AppError(message, 400);
};

const handleValidationErrDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTErr = () =>
  new AppError('invalid token. Please log in again.', 401);

const handleJWTExpiredErr = () => new AppError('Your token has expired!', 401);

const handleSqlzeValidationErr = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleCsrfTokenError = () => new AppError('CSRF validation error', 403);

const sendDevErr = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // RENDERED WEBSITE
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

const sendProdErr = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      mylog.log('ERROR👺', err);

      res.status(500).json({
        status: 'error',
        message: 'something went very wrong!',
      });
    }
  } else {
    // RENDERED WEBSITE
    if (err.isOperational) {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });
    } else {
      mylog.log('ERROR👺', err);

      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevErr(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message, name: err.name };

    if (error.code === 11000) error = handleDuplicateErrDB(error);
    if (error.name === 'CastError') error = handleCastErrDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTErr();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredErr();
    if (error.name === 'SequelizeValidationError')
      error = handleSqlzeValidationErr(error);
    if (error.name === 'invalidCsrfTokenError') error = handleCsrfTokenError();

    sendProdErr(error, req, res);
  }
};
