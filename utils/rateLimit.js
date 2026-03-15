'use strict';
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message: 'Attempts limit exceeded. Please try again later.',
});

module.exports = authLimiter;
