const express = require('express');
const controller = require('../controllers/uploadsController');
const authController = require('../controllers/authController');
const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    controller.getUploadRecords,
  )
  .post(
    authController.protect,
    controller.uploadFile,
    controller.validateFileType,
    controller.validateImageContent,
    controller.validatePDFContent,
    controller.processImage,
    controller.sanitizeFile,
    controller.testFunction,
  );

module.exports = router;
