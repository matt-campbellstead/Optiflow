const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  id: {
    type: String,
  },

  originalName: {
    type: String,
  },

  filename: {
    type: String,
  },

  path: {
    type: String,
  },

  size: {
    type: Number,
  },

  mimeType: {
    type: String,
  },

  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  uploadedAt: {
    type: Date,
  },
});

fileSchema.pre(/^find/, function () {
  this.populate({ path: 'uploadedBy', select: '-shipments -__v' });
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
