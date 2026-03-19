'use strict';
const { sequelize } = require('../sequelize/db');
const { Model, DataTypes } = require('sequelize');
// const arr = [
//   'Cargo Collected / FCL and LCL',
//   'Received at Depot / FCL and LCL',
//   'Cargo Packed / LCL',
//   'Depot LRD Date / LCL',
//   'Cargo Loaded/Stuffed / LCL',
//   'Cargo Departed Port/Airport',
//   'OBL/AWB Received',
//   'ANF/Pre-Alert Received',
//   'Customer Invoiced',
//   'Payment Received',
//   'Line Release received',
//   'Clearing Instruction Issued',
//   'Delivery Instruction Issued',
//   'Signed CI received',
//   'SARS Submission',
//   'Cargo Arrived Port/Airport',
//   'Cargo Released/ SARS',
//   'Cargo Unpacked (LCL)',
//   'Cargo Delivered',
//   'Document Pack Sent',
// ];
class Timeline extends Model {}

Timeline.init(
  {
    collected: { type: DataTypes.BOOLEAN, defaultValue: false },
    atDepot: { type: DataTypes.BOOLEAN, defaultValue: false },
    packed: { type: DataTypes.BOOLEAN, defaultValue: false },
    lrd: { type: DataTypes.BOOLEAN, defaultValue: false },
    loaded: { type: DataTypes.BOOLEAN, defaultValue: false },
    departedToPort: { type: DataTypes.BOOLEAN, defaultValue: false },
    obl_awb_received: { type: DataTypes.BOOLEAN, defaultValue: false },
    anf_pre_received: { type: DataTypes.BOOLEAN, defaultValue: false },
    invoiced: { type: DataTypes.BOOLEAN, defaultValue: false },
    payment: { type: DataTypes.BOOLEAN, defaultValue: false },
    lineRelease: { type: DataTypes.BOOLEAN, defaultValue: false },
    instructionClearing: { type: DataTypes.BOOLEAN, defaultValue: false },
    instructionDelivery: { type: DataTypes.BOOLEAN, defaultValue: false },
    signedCi: { type: DataTypes.BOOLEAN, defaultValue: false },
    sars: { type: DataTypes.BOOLEAN, defaultValue: false },
    arrivedAtPort: { type: DataTypes.BOOLEAN, defaultValue: false },
    released: { type: DataTypes.BOOLEAN, defaultValue: false },
    unpacked: { type: DataTypes.BOOLEAN, defaultValue: false },
    delivered: { type: DataTypes.BOOLEAN, defaultValue: false },
    docSent: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: 'Timeline',
    timestamps: true,
  },
);

Timeline.sync();

module.exports = Timeline;
