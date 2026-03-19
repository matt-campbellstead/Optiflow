'use strict';
const mylog = require('../log');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { promisify } = require('util');
const User = require('../models/mongooseModel');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');
const Master = require('../models/masterModel');

const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    ),
    //secure: true, // Can only be sent in a secure connection
    httpOnly: true, // Can not be accessed by the browser
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  newUser.password = undefined;
  newUser.passwordConfirm = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

exports.logIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(
      new AppError('Please provide both your email and your password.', 400),
    );

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(
      new AppError('Email or password is incorrect! Please try again.', 401),
    );

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  user.password = undefined;
  user.passwordConfirm = undefined;

  rateLimit();

  //console.log(user);
  createSendToken(user, 200, res);
});

exports.logOut = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization?.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id).select('+role');
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token no longer exists', 401),
    );

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401),
    );
  }

  // Access granted:
  res.locals.user = currentUser;
  req.user = currentUser;
  // mylog.log(currentUser);
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  // ONLY for rendered pages, and there will be no errors
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // Checking if the user still exists
      const freshUser = await User.findById(decoded.id).select('+role');
      if (!freshUser) {
        return next();
      }

      // Checking if the user changed passwords after the token was issued
      if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // There is a logged in user
      res.locals.user = freshUser;
      req.user = freshUser;
      //console.log(req.user);
      return next(); // Fixes headers error 'cannot set headers after they are sent to the client'
    } catch (err) {
      mylog.log(err);
      return next();
    }
  }
  next();
};

exports.restrictToUser = () => {
  return async (req, res, next) => {
    const shipment = await Master.findOne({ where: { id: req.params.id } });

    if (!shipment) return next(new AppError('Cannot find that data.', 404));

    const id = String(req.user._id);

    const idArr = Array.isArray(shipment.users)
      ? shipment.users
      : [shipment.users];
    if (!idArr.includes(id)) {
      return next(new AppError('You do not have permission to do that.', 403));
    }
    next();
  };
};
exports.restrictToAdmin = () => {
  return (req, res, next) => {
    if (!(req.user.role === 'admin'))
      return next(new AppError('You do not have permission to do that.', 403));
    next();
  };
};

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new AppError(
        'Cannot find that user details. Check your email address.',
        404,
      ),
    );

  const resetToken = user.createPasswResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new
  password and passwordConfirm to: ${resetURL}\nIf you didn't forget it, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later.',
        500,
      ),
    );
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Send the token
  createSendToken(user, 200, res);
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('Your current password is wrong', 401));

  // Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Log user in, send JWT
  createSendToken(user, 200, res);
});
