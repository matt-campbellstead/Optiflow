const mylog = require('../log');
// I had to do custom logging because the console output wasn't available on the hosting platform
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/mongooseModel');
const RefreshToken = require('../models/mongooseToken');
const AppError = require('../utils/AppError');
const Email = require('../utils/email');

const {
  hashToken,
  createJti,
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  setRefreshCookie,
  rotateRefreshToken,
  setAccessCookie,
} = require('../utils/tokens');

// The asyncHandler catches errors and then the errors are routed through errorController.js
exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError('This user already exists!', 500));

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm: req.body.passwordConfirm,
  });

  newUser.password = undefined;
  newUser.passwordConfirm = undefined;

  const url = `${req.protocol}://${req.get('host')}/login`;

  await new Email(newUser, url).sendWelcome();

  res.status(200).json({
    status: 'success',
    //token,
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

  user.password = undefined;
  user.passwordConfirm = undefined;

  const accessToken = signAccessToken(user);

  setAccessCookie(res, accessToken);

  const jti = createJti();

  const refreshToken = signRefreshToken(user, jti);

  await persistRefreshToken({
    user,
    refreshToken,
    jti,
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
  });

  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    status: 'success',
  });
});

exports.logOut = asyncHandler(async (req, res) => {
  const token = req.cookies?.refresh_token;

  if (!token) return next(new AppError('No refresh token.', 404));

  if (token) {
    const tokenHash = hashToken(token);

    const doc = await RefreshToken.findOne({ tokenHash });

    if (!doc) return next(new AppError('No document!', 404));

    if (doc && !doc.revokedAt) {
      doc.revokedAt = new Date();
      console.log(`revoked at: ${doc.revokedAt}`);
      await doc.save();
    }
  }

  res.clearCookie('refresh_token', { path: '/api/v1/users/auth' });
  res.clearCookie('access_token');

  res.status(200).json({
    status: 'success',
    message: 'Logged out',
  });
});

// Currently, the user has to see that their access token has expired and
// then manually they have to request this endpoint to get it refreshed...
// This would happen every 15 minutes. I would prefer to automate it but
// still have to figure that out.
exports.refresh = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refresh_token;

  if (!token) return next(new AppError('No refresh token found!', 401));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return next(new AppError('Invalid or expired refresh token.', 401));
  }

  const tokenHash = hashToken(token);
  const doc = await RefreshToken.findOne({
    tokenHash,
    jti: decoded.jti,
  }).populate('user');

  if (!doc) {
    return next(new AppError('Refresh token not recognized', 401));
  }
  if (doc.revokedAt) {
    return next(new AppError('Refresh token revoked', 401));
  }
  if (doc.expiresAt < new Date()) {
    return next(new AppError('Refresh token expired', 401));
  }

  const result = await rotateRefreshToken(doc, doc.user, req, res);
  setAccessCookie(res, result.accessToken);
  res.status(200).json({ status: 'success' });
});

exports.protect = asyncHandler(async (req, res, next) => {
  console.log('request method:', req.method);
  console.log('request original URL:', req.originalUrl);
  console.log('req.cookies:', Object.keys(req.cookies));
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization?.split(' ')[1];
  } else if (req.cookies.access_token) {
    token = req.cookies.access_token;
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
  let token;

  if (req.cookies.access_token) {
    token = token = req.cookies.access_token;

    try {
      const decoded = await promisify(jwt.verify)(
        token,
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

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
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
    return next(new AppError('Reset token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Clear current refresh token
  const token = req.cookies?.refresh_token;

  if (!token) return next(new AppError('No refresh token.', 404));

  if (token) {
    const tokenHash = hashToken(token);

    const doc = await RefreshToken.findOne({ tokenHash });

    if (!doc) return next(new AppError('No document!', 404));

    if (doc && !doc.revokedAt) {
      doc.revokedAt = new Date();
      console.log(`revoked at: ${doc.revokedAt}`);
      await doc.save();
    }
  }

  res.clearCookie('refresh_token', { path: '/api/v1/users/auth' });
  res.clearCookie('access_token', { path: '/api/v1/users/' });

  // Issue new access token and refresh token
  const accessToken = signAccessToken(user);

  setAccessCookie(res, accessToken);

  const jti = createJti();

  const refreshToken = signRefreshToken(user, jti);

  await persistRefreshToken({
    user,
    refreshToken,
    jti,
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
  });

  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    status: 'success',
  });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('Your current password is wrong', 401));

  // Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Clear current refresh token
  const token = req.cookies?.refresh_token;

  if (!token) return next(new AppError('No refresh token.', 404));

  if (token) {
    const tokenHash = hashToken(token);

    const doc = await RefreshToken.findOne({ tokenHash });

    if (!doc) return next(new AppError('No document!', 404));

    if (doc && !doc.revokedAt) {
      doc.revokedAt = new Date();
      console.log(`revoked at: ${doc.revokedAt}`);
      await doc.save();
    }
  }

  res.clearCookie('refresh_token', { path: '/api/v1/users/auth' });
  res.clearCookie('access_token', { path: '/api/v1/users/' });

  // Issue new access token and refresh token
  const accessToken = signAccessToken(user);

  const jti = createJti();

  const refreshToken = signRefreshToken(user, jti);

  await persistRefreshToken({
    user,
    refreshToken,
    jti,
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
  });

  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    status: 'success',
    accessToken,
  });
});
