const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name.'],
    trim: true,
    maxlength: [40, 'Too long! Maximum 40 characters.'],
    match: [
      new RegExp(/^[a-zA-Z\s]+$/),
      '{VALUE} is not valid. Please use only letters',
    ],
  },

  email: {
    type: String,
    required: [true, 'Please enter an email address.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid address'],
  },

  role: {
    type: String,
    validate: [validator.isAlpha, 'This field must only contain letters'],
    enum: ['user', 'admin'],
    default: 'user',
    select: false,
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Too short! The password must be at least 8 characters.'],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      // Only works on .create() and .save()
      validator: function (string) {
        return string === this.password; // TRUE or FALSE
      },
      message: 'Not the same as your password. The passwords must match!',
    },
  },

  passwordChangedAt: { type: Date },

  passwordResetToken: String,

  passwordResetExpires: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  shipments: [{ type: mongoose.Schema.ObjectId, ref: 'Usershipment' }],
});

// Query, doc middleware
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;

  this.passwordChangedAt = Date.now() - 1000;
});

// Instance methods
userSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass); // returns TRUE or FALSE
};

userSchema.methods.changedPasswordAfter = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTtimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
