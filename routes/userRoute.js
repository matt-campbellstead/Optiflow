const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/auth/signup', authController.signUp);
router.post('/auth/login', authController.logIn);
router.get('/auth/logout', authController.logOut);
router.post('/auth/forgotpassword', authController.forgotPassword);
router.get('/auth/refresh', authController.refresh);
router.patch('/auth/resetpassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/auth/updatemypassword', authController.updatePassword);

router
  .route('/')
  .get(authController.restrictTo('admin'), userController.getUsers);

router
  .route('/:id')
  .get(authController.restrictTo('admin'), userController.getUser);

module.exports = router;
