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
  .get(controller.shippersCrud.getShippers)
  .post(controller.shippersCrud.createShippers)
  .delete(
    authController.restrictToAdmin(),
    controller.shippersCrud.deleteShippers,
  );

router
  .route('/timeline')
  .get(controller.timelineCrud.getTimeline)
  .post(controller.timelineCrud.createTimeline)
  .delete(
    authController.restrictToAdmin(),
    controller.timelineCrud.deleteTimeline,
  );

router
  .route('/shipment-details')
  .get(controller.detailsCrud.getDetails)
  .post(controller.detailsCrud.createDetails)
  .delete(
    authController.restrictToAdmin(),
    controller.detailsCrud.deleteDetails,
  );

router
  .route('/conveyance')
  .get(controller.conveyanceCrud.getConveyance)
  .post(controller.conveyanceCrud.createConveyance)
  .delete(
    authController.restrictToAdmin(),
    controller.conveyanceCrud.deleteConveyance,
  );

router
  .route('/customs')
  .get(controller.customsCrud.getCustoms)
  .post(controller.customsCrud.createCustoms)
  .delete(
    authController.restrictToAdmin(),
    controller.customsCrud.deleteCustoms,
  );

router
  .route('/financials')
  .get(controller.financialsCrud.getFinancials)
  .post(controller.financialsCrud.createFinancials)
  .delete(
    authController.restrictToAdmin(),
    controller.financialsCrud.deleteFinancials,
  );
router
  .route('/customers')
  .get(controller.customersCrud.getCustomers)
  .post(controller.customersCrud.createCustomers)
  .delete(
    authController.restrictToAdmin(),
    controller.customersCrud.deleteCustomers,
  );

router
  .route('/consignees')
  .get(controller.consigneesCrud.getConsignees)
  .post(controller.consigneesCrud.createConsignees)
  .delete(
    authController.restrictToAdmin(),
    controller.consigneesCrud.deleteConsignees,
  );
router
  .route('/:id')
  .get(
    authController.restrictToUser(), // Only users will be able to view their documents on their own
    controller.getSingleData,
  )
  .patch(authController.restrictToAdmin(), controller.updateMasterData);

router.use(authController.restrictToAdmin());

router.route('/customs/:id').patch(controller.customsCrud.updateCustoms);
router
  .route('/financials/:id')
  .patch(controller.financialsCrud.updateFinancials);
router
  .route('/conveyance/:id')
  .patch(controller.conveyanceCrud.updateConveyance);
router
  .route('/shipment-details/:id')
  .patch(controller.detailsCrud.updateDetails)
  .get(controller.detailsCrud.getSingleDetails);
router.route('/timeline/:id').patch(controller.timelineCrud.updateTimeline);
router.route('/shippers/:id').patch(controller.shippersCrud.updateShippers);
router
  .route('/customers/:id')
  .patch(controller.customersCrud.updateCustomers)
  .get(controller.customersCrud.getSingleCustomers);
router
  .route('/consignees/:id')
  .patch(controller.consigneesCrud.updateConsignees)
  .get(controller.consigneesCrud.getSingleConsignees);

module.exports = router;
