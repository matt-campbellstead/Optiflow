'use strict';
const express = require('express');
const controller = require('../controllers/dataController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictToAdmin(), controller.getData)
  .post(authController.restrictToAdmin(), controller.createData)
  .delete(authController.restrictToAdmin(), controller.deleteAllData);

router
  .route('/:id')
  .get(
    authController.restrictToUser(), // Only users will be able to view their documents on their own
    controller.getSingleData,
  )
  .patch(authController.restrictToAdmin(), controller.updateData);

module.exports = router;
