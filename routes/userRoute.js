'use strict';
const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const dbxRouter = require('./dbxRoute');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.get('/logout', authController.logOut);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.use('/:userid/shipmentlogs', dbxRouter);

router.use(authController.protect);

router.patch(
  '/updatemypassword',

  authController.updatePassword,
);
router
  .route('/')
  .get(authController.restrictToAdmin(), userController.getUsers);

router
  .route('/:id')
  .get(authController.restrictToAdmin(), userController.getUser);

module.exports = router;
