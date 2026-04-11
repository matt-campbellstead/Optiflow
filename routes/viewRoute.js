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
router.get('/ops-functions', authController.protect, controller.opsFunctions);
router.get('/ops-data', authController.protect, controller.submitData);
router.get(
  '/ops-past-shipments',
  authController.protect,
  controller.opsOldShipments,
);
router.get('/ops-exports', authController.protect, controller.opsExports);
router.get('/ops-imports', authController.protect, controller.opsImports);
router.get('/ops-update', authController.protect, controller.updateShipment);

module.exports = router;
