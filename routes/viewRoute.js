const express = require('express');
const { doubleCsrf } = require('csrf-csrf');
const controller = require('../controllers/viewController');
const authController = require('../controllers/authController');
const router = express.Router();

const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'default-csrf-secret',
  getSessionIdentifier: (req) => req.cookies.jwt || 'default non-token message', //req.cookies.jwt,
  cookieName: 'my-csrf-token', //CHANGE TO '__Secure-my-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});

router.use(doubleCsrfProtection);

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
