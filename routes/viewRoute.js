const express = require('express');
const controller = require('../controllers/viewController');
const authController = require('../controllers/authController');
const { doubleCsrfProtection } = require('../utils/tokens');
const router = express.Router();

router.use(doubleCsrfProtection);
router.get('/', authController.isLoggedIn, controller.homePage);
router.get('/login', authController.isLoggedIn, controller.logInUser);

router.get('/dashboard', authController.isLoggedIn, controller.displayShipment);

router.use(authController.protect);

router.get('/ops-dashboard', controller.displayAllShipments);
router.get('/ops-functions', controller.opsFunctions);
router.get('/ops-data', controller.submitData);
router.get('/ops-past-shipments', controller.opsOldShipments);
router.get('/ops-exports', controller.opsExports);
router.get('/ops-imports', controller.opsImports);
router.get('/ops-update', controller.updateShipment);

module.exports = router;
