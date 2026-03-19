'use strict';
const mongoose = require('mongoose');

const usershipmentSchema = new mongoose.Schema({
  shipment: {
    type: Number,
    required: true,
    match: [
      new RegExp(/^[0-9]+$/),
      '{VALUE} is not valid. Please use only numbers',
    ],
  },
  client: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

usershipmentSchema.pre(/^find/, function () {
  this.populate({ path: 'client', select: '-shipments -__v' });
});

const Usershipment = mongoose.model('Usershipment', usershipmentSchema);
module.exports = Usershipment;
