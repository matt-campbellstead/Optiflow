'use strict';
const express = require('express');
const controller = require('../controllers/dbxController');
const authController = require('../controllers/authController');
const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.route('/').get(controller.getUserShipments);

module.exports = router;
