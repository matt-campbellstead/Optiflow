const express = require('express');
const controller = require('../controllers/viewController');
const authController = require('../controllers/authController');
const { doubleCsrfProtection } = require('../utils/tokens');
const router = express.Router();

router.use(doubleCsrfProtection);
router.get('/', authController.isLoggedIn, controller.homePage);
router.get('/login', authController.isLoggedIn, controller.logInUser);

router.get('/dashboard', authController.isLoggedIn, controller.displayShipment);
router.get('/account-activation', controller.activateAccount);
router.get('/reset-init', controller.resetPasswordInit);
router.get('/reset-action', controller.resetPasswordAction);
router.get('/sign-up', controller.signUp);

router.use(authController.protect);

router.get('/ops-dashboard', controller.displayAllShipments);
router.get('/ops-functions', controller.opsFunctions);
router.get('/ops-data', controller.submitData);

router.route('/ops-update/{*all}').get(controller.updateShipment);
//router.get('/ops-update/', controller.updateShipment);

module.exports = router;
