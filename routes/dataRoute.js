'use strict';
const express = require('express');
const controller = require('../controllers/dataController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictToAdmin(), controller.getMasterData)
  .post(authController.restrictToAdmin(), controller.createMasterData)
  .delete(authController.restrictToAdmin(), controller.deleteMasterData);

router
  .route('/shippers')
  .get(controller.getShippers)
  .post(controller.createShippers)
  .delete(authController.restrictToAdmin(), controller.deleteShippers);

router
  .route('/timeline')
  .get(controller.getTimeline)
  .post(controller.createTimeline)
  .delete(authController.restrictToAdmin(), controller.deleteTimeline);

router
  .route('/shipment-details')
  .get(controller.getDetails)
  .post(controller.createDetails)
  .delete(authController.restrictToAdmin(), controller.deleteDetails);

router
  .route('/conveyance')
  .get(controller.getConveyance)
  .post(controller.createConveyance)
  .delete(authController.restrictToAdmin(), controller.deleteConveyance);

router
  .route('/customs')
  .get(controller.getCustoms)
  .post(controller.createCustoms)
  .delete(authController.restrictToAdmin(), controller.deleteCustoms);

router
  .route('/financials')
  .get(controller.getFinancials)
  .post(controller.createFinancials)
  .delete(authController.restrictToAdmin(), controller.deleteFinancials);
router
  .route('/customers')
  .get(controller.getCustomers)
  .post(controller.createCustomers)
  .delete(controller.deleteCustomers);

router
  .route('/consignees')
  .get(controller.getConsignees)
  .post(controller.createConsignees)
  .delete(controller.deleteConsignees);
router
  .route('/:id')
  .get(
    authController.restrictToUser(), // Only users will be able to view their documents on their own
    controller.getSingleData,
  )
  .patch(authController.restrictToAdmin(), controller.updateMasterData);

router.use(authController.restrictToAdmin());

router.route('/customs/:id').patch(controller.updateCustoms);
router.route('/financials/:id').patch(controller.updateFinancials);
router.route('/conveyance/:id').patch(controller.updateConveyance);
router
  .route('/shipment-details/:id')
  .patch(controller.updateDetails)
  .get(controller.getSingleDetails);
router.route('/timeline/:id').patch(controller.updateTimeline);
router.route('/shippers/:id').patch(controller.updateShippers);
router
  .route('/customers/:id')
  .patch(controller.updateCustomers)
  .get(controller.getSingleCustomers);
router
  .route('/consignees/:id')
  .patch(controller.updateConsignees)
  .get(controller.getSingleConsignees);

module.exports = router;
