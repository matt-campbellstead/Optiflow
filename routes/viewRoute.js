const express = require('express');
const controller = require('../controllers/viewController');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/', authController.isLoggedIn, controller.homePage);
router.get('/login', authController.isLoggedIn, controller.logInUser);
router.get('/dashboard', authController.isLoggedIn, controller.displayShipment);
router.get(
  '/ops-dashboard',
  authController.protect,
  controller.displayAllShipments,
);
router.get('/ops-functions', authController.protect, controller.displayUsers);
router.post('/ops-create-post', controller.submitShipment);

module.exports = router;
