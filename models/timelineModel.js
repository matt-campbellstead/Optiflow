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
    cargo_collected: { type: DataTypes.BOOLEAN, defaultValue: false },
    cargo_collected_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    received: { type: DataTypes.BOOLEAN, defaultValue: false },
    cargo_packed: { type: DataTypes.BOOLEAN, defaultValue: false },
    depot_lrd: { type: DataTypes.BOOLEAN, defaultValue: false },
    cargo_loaded: { type: DataTypes.BOOLEAN, defaultValue: false },
    cargo_departed: { type: DataTypes.BOOLEAN, defaultValue: false },
    obl_awb: { type: DataTypes.BOOLEAN, defaultValue: false },
    anf_pre: { type: DataTypes.BOOLEAN, defaultValue: false },
    customer: { type: DataTypes.BOOLEAN, defaultValue: false },
    payment: { type: DataTypes.BOOLEAN, defaultValue: false },
    line: { type: DataTypes.BOOLEAN, defaultValue: false },
    clearing: { type: DataTypes.BOOLEAN, defaultValue: false },
    delivery: { type: DataTypes.BOOLEAN, defaultValue: false },
    signed: { type: DataTypes.BOOLEAN, defaultValue: false },
    sars: { type: DataTypes.BOOLEAN, defaultValue: false },
    cargo_arrived: { type: DataTypes.BOOLEAN, defaultValue: false },
    cargo_released: { type: DataTypes.BOOLEAN, defaultValue: false },
    cargo_unpacked: { type: DataTypes.BOOLEAN, defaultValue: false },
    cargo_delivered: { type: DataTypes.BOOLEAN, defaultValue: false },
    doc: { type: DataTypes.BOOLEAN, defaultValue: false },
    received_at_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    cargo_packed_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    depot_lrd_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    cargo_loaded_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    cargo_departed_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    obl_awb_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    anf_pre_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    customer_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    line_release_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    clearing_instruction_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    delivery_instruction_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    signed_ci_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    sars_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    cargo_arrived_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    cargo_released_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    cargo_unpacked_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    cargo_delivered_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    document_pack_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Timeline',
    timestamps: true,
  },
);

Timeline.sync();

module.exports = Timeline;
